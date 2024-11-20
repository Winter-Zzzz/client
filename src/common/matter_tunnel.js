const CryptoJS = require("crypto-js");
const elliptic = require("elliptic");
const BigInt = require("big-integer");
const ec = new elliptic.ec("p256");

class MatterTunnel {
  // Converts byte array to hex string
  static #bytesToHex(data) {
    return Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Converts hex string to byte array
  static #hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
  }

  // Gets type string representation
  static #getTypeString(types) {
    let result = "";

    // Handle argument types (top 14 bits - 7 pairs of 2 bits)
    for (let i = 6; i >= 0; i--) {
      const argType = (types >> (i * 2 + 2)) & 0x03;
      if (argType === 0x00) break; // void means no more arguments

      if (result.length > 0) {
        result += ",";
      }

      switch (argType) {
        case 0x01:
          result += "string";
          break;
        case 0x02:
          result += "number";
          break;
        case 0x03:
          result += "Boolean";
          break;
        default:
          break;
      }
    }

    result += ")";

    // Handle return type (bottom 2 bits)
    let returnType;
    switch (types & 0x03) {
      case 0x00:
        returnType = "void";
        break;
      case 0x01:
        returnType = "string";
        break;
      case 0x02:
        returnType = "number";
        break;
      case 0x03:
        returnType = "Boolean";
        break;
      default:
        break;
    }

    return result + "->" + returnType;
  }

  // Serialize data list to byte array
  static #serializeDataList(dataList) {
    const serialized = [];

    for (const data of dataList) {
      // Add length as 1 byte
      serialized.push(data.length);

      // Add data
      for (let i = 0; i < data.length; i++) {
        serialized.push(data.charCodeAt(i));
      }
    }

    return new Uint8Array(serialized);
  }

  // Deserialize byte array to data list
  static #deserializeDataList(serializedData) {
    const result = [];
    let pos = 0;

    while (pos < serializedData.length) {
      // Read length (1 byte)
      const length = serializedData.charCodeAt(pos++);

      // Extract data
      if (pos + length <= serializedData.length) {
        result.push(serializedData.substr(pos, length));
        pos += length;
      } else {
        break; // Invalid format
      }
    }

    return result;
  }

  // Helper function to convert WordArray to Uint8Array
  static #wordArrayToUint8Array(wordArray) {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    let byte;
    let offset = 0;

    for (let i = 0; i < sigBytes; i++) {
      byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[offset++] = byte;
    }

    return u8;
  }

  // Helper function to convert Uint8Array to WordArray
  static #uint8ArrayToWordArray(u8arr) {
    const len = u8arr.length;
    const words = [];
    for (let i = 0; i < len; i++) {
      words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
  }

  // Public methods
  static generatePrivateKey() {
    const keyPair = ec.genKeyPair();
    return keyPair.getPrivate("hex").padStart(64, "0");
  }

  static derivePublicKey(privateKeyHex) {
    try {
      const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
      return keyPair.getPublic(false, "hex").padStart(130, "0");
    } catch (error) {
      throw new Error("Failed to derive public key");
    }
  }

  static sign(message, privateKeyHex) {
    try {
      // Create hash of the message
      const msgHash = CryptoJS.SHA256(message);
      const hashHex = msgHash.toString(CryptoJS.enc.Hex);

      // Sign the hash
      const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
      const signature = keyPair.sign(hashHex);

      // Get r and s values, pad to 32 bytes each
      const r = signature.r.toString("hex").padStart(64, "0");
      const s = signature.s.toString("hex").padStart(64, "0");

      return r + s;
    } catch (error) {
      throw new Error("Failed to create signature");
    }
  }

  static verify(signatureHex, message, publicKeyHex) {
    if (signatureHex.length !== 128) {
      throw new Error("Invalid signature length");
    }

    try {
      // Split signature into r and s
      const r = signatureHex.substring(0, 64);
      const s = signatureHex.substring(64);

      // Create hash of the message
      const msgHash = CryptoJS.SHA256(message);
      const hashHex = msgHash.toString(CryptoJS.enc.Hex);

      // Create key and signature objects
      const key = ec.keyFromPublic(publicKeyHex, "hex");
      const signature = { r, s };

      // Verify
      return key.verify(hashHex, signature);
    } catch (error) {
      throw new Error("Signature verification failed");
    }
  }

  static getSharedKey(secretKeyHex, publicKeyHex) {
    try {
      const keyPair = ec.keyFromPrivate(secretKeyHex, "hex");
      const pubKey = ec.keyFromPublic(publicKeyHex, "hex");

      // Compute shared point
      const shared = keyPair.derive(pubKey.getPublic());

      // Convert to 32-byte hex string
      return shared.toString(16).padStart(64, "0");
    } catch (error) {
      throw new Error("Failed to compute shared key");
    }
  }

  static encrypt(key, msg) {
    try {
      // Generate random IV
      const iv = CryptoJS.lib.WordArray.random(16);

      // Create key hash
      const keyHash = CryptoJS.SHA256(key);

      // Encrypt using AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(msg, keyHash, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Combine IV and ciphertext
      const combined = CryptoJS.lib.WordArray.create()
        .concat(iv)
        .concat(encrypted.ciphertext);

      return combined.toString(CryptoJS.enc.Hex);
    } catch (error) {
      throw new Error("Encryption failed");
    }
  }

  static decrypt(key, encryptedHex) {
    try {
      // Convert hex to bytes
      const encrypted = this.#hexToBytes(encryptedHex);
      if (encrypted.length < 16) {
        throw new Error("Invalid encrypted data length");
      }

      // Extract IV and ciphertext
      const iv = encrypted.slice(0, 16);
      const ciphertext = encrypted.slice(16);

      // Convert to CryptoJS format
      const ivWordArray = this.#uint8ArrayToWordArray(iv);
      const ciphertextWordArray = this.#uint8ArrayToWordArray(ciphertext);

      // Create key hash
      const keyHash = CryptoJS.SHA256(key);

      // Create cipher params
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertextWordArray,
      });

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(cipherParams, keyHash, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error("Decryption failed: " + error.message);
    }
  }

  static extractDeviceInfo(data) {
    // 최소 크기 검증 (publicKey(33) + passcode(16))
    if (!(data instanceof Uint8Array) || data.length < 49) {
      throw new Error("Invalid data size");
    }

    try {
      // 1. Compressed Public Key (33 bytes) 처리
      const compressedKey = this.#bytesToHex(data.slice(0, 33));
      const keyPair = ec.keyFromPublic(compressedKey, "hex");
      const uncompressedKey = keyPair.getPublic(false, "hex");

      // 2. Passcode (16 bytes) 처리
      const passcode = data.slice(33, 49);
      const passcodeHex = this.#bytesToHex(passcode);

      // 3. Functions 처리
      const functions = [];
      let pos = 49;

      while (pos + 20 <= data.length) {
        // Function name (18 bytes)
        let funcName = "";
        for (let i = 0; i < 18; i++) {
          if (data[pos + i] !== 0) {
            funcName += String.fromCharCode(data[pos + i]);
          }
        }

        // Function types (2 bytes)
        const types = (data[pos + 18] << 8) | data[pos + 19];
        const funcSig = funcName + "(" + this.#getTypeString(types);
        functions.push(funcSig);

        pos += 20;
      }

      // JSON 형식의 출력 생성
      return JSON.stringify({
        publicKey: uncompressedKey,
        passcode: passcodeHex,
        functions: functions,
      });
    } catch (error) {
      throw new Error("Failed to extract device info: " + error.message);
    }
  }

  static makeTX(funcName, src_priv, dest_pub, data_list) {
    try {
      // 1. 공유키 생성
      const sharedKey = this.getSharedKey(src_priv, dest_pub);

      // 2. src_pub 파생
      const src_pub = this.derivePublicKey(src_priv);

      // 3. Uncompressed public key를 compressed 형식으로 변환
      const keyPair = ec.keyFromPublic(src_pub, "hex");
      const compressedKeyHex = keyPair.getPublic(true, "hex");
      const compressedKey = this.#hexToBytes(compressedKeyHex);

      // 4. 데이터 직렬화
      const serializedData = this.#serializeDataList(data_list);

      // 5. 직렬화된 데이터 암호화
      const encryptedData = this.encrypt(
        sharedKey,
        String.fromCharCode.apply(null, serializedData)
      );
      const encryptedBytes = this.#hexToBytes(encryptedData);

      // 6. 현재 타임스탬프 생성
      const timestamp = BigInt(Math.floor(Date.now() / 1000));
      const timestampBytes = new Uint8Array(8);
      for (let i = 0; i < 8; i++) {
        timestampBytes[i] = Number((timestamp >> BigInt(i * 8)) & BigInt(0xff));
      }

      // 7. TX 데이터 조합
      const result = new Uint8Array(18 + 33 + 8 + encryptedBytes.length);

      // 7.1 Function name (18 bytes)
      const paddedFuncName = funcName.padEnd(18, "\0");
      for (let i = 0; i < 18; i++) {
        result[i] = paddedFuncName.charCodeAt(i);
      }

      // 7.2 Compressed public key (33 bytes)
      result.set(compressedKey, 18);

      // 7.3 Timestamp (8 bytes)
      result.set(timestampBytes, 51);

      // 7.4 Encrypted data
      result.set(encryptedBytes, 59);

      // 8. 서명 생성
      const signature = this.sign(this.#bytesToHex(result), src_priv);
      const signatureBytes = this.#hexToBytes(signature);

      // 9. 최종 결과 조합: signature + TX data
      const finalResult = new Uint8Array(signatureBytes.length + result.length);
      finalResult.set(signatureBytes, 0);
      finalResult.set(result, signatureBytes.length);

      return finalResult;
    } catch (error) {
      throw new Error("Failed to make TX: " + error.message);
    }
  }

  static extractTXData(privateKey, txBytes) {
    try {
      if (!(txBytes instanceof Uint8Array) || txBytes.length < 123) {
        // 64 + 18 + 33 + 8
        throw new Error("Invalid TX data size");
      }

      // 1. 서명과 데이터 분리
      const signature = txBytes.slice(0, 64);
      const txData = txBytes.slice(64);

      // 2. 데이터 파싱
      // 2.1 Function name (18 bytes)
      let funcName = "";
      for (let i = 0; i < 18; i++) {
        if (txData[i] !== 0) {
          funcName += String.fromCharCode(txData[i]);
        }
      }

      // 2.2 Compressed public key (33 bytes) 처리
      const compressedPubKey = txData.slice(18, 51);
      const keyPair = ec.keyFromPublic(Array.from(compressedPubKey), "hex");
      const srcPub = keyPair.getPublic(false, "hex");

      // 2.3 서명 검증
      const signatureHex = this.#bytesToHex(signature);
      const txDataStr = this.#bytesToHex(txData);

      if (!this.verify(signatureHex, txDataStr, srcPub)) {
        throw new Error("Invalid signature");
      }

      // 2.4 Timestamp (8 bytes)
      let timestamp = BigInt(0);
      for (let i = 0; i < 8; i++) {
        timestamp |= BigInt(txData[51 + i]) << BigInt(i * 8);
      }

      // 2.5 암호화된 데이터
      const encryptedData = txData.slice(59);
      const encryptedHex = this.#bytesToHex(encryptedData);

      // 3. 공유키 생성 및 복호화
      const sharedKey = this.getSharedKey(privateKey, srcPub);
      const decryptedData = this.decrypt(sharedKey, encryptedHex);

      // 4. 복호화된 데이터 역직렬화
      const dataList = this.#deserializeDataList(decryptedData);

      // 5. JSON 형식으로 결과 생성
      return JSON.stringify({
        funcName: funcName,
        srcPub: srcPub,
        timeStamp: timestamp.toString(),
        data: dataList,
      });
    } catch (error) {
      throw new Error("Failed to extract TX data: " + error.message);
    }
  }
}

export default MatterTunnel;
