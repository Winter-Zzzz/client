import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addDevice } from "../states/deviceSlice";
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";

const QRScanner = () => {
  const dispatch = useDispatch();
  const [qrScanError, setQrScanError] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handleScan = async (data) => {
    // QR 코드에서 데이터를 받아오기 위해 latin1 에서 uint8array를 반환하는 함수
    function latin1ToUint8Array(str) {
      // 입력 문자열 길이만큼의 Uint8Array 생성
      const uint8Array = new Uint8Array(str.length);

      // 각 문자를 순회하면서 Latin-1 인코딩으로 변환
      for (let i = 0; i < str.length; i++) {
        // charCodeAt()은 0-255 범위의 Latin-1 문자 코드를 반환
        const charCode = str.charCodeAt(i);

        // Latin-1은 8비트(1바이트) 인코딩이므로 255를 초과하는 문자는 처리할 수 없음
        if (charCode > 0xff) {
          throw new Error(
            `Character at position ${i} has code point ${charCode} which is outside Latin-1 range (0-255)`
          );
        }

        uint8Array[i] = charCode;
      }

      return uint8Array;
    }

    if (data) {
      const uint8Data = latin1ToUint8Array(data.text);
      console.log(uint8Data);
      const info = MatterTunnel.extractDeviceInfo(uint8Data);
      console.log(JSON.parse(info));

      //   setPublicKey(data);
      //   await fetchDeviceTypeByPublicKey(data);
    }
  };

  const fetchDeviceTypeByPublicKey = async (publicKey) => {
    try {
      const response = await fetch(`/api/device/${publicKey}`);
      const deviceData = await response.json();
      setDeviceType(deviceData.deviceType);

      // Redux
      dispatch(addDevice({ deviceType: deviceData.deviceType, publicKey }));
      setPublicKey("");
      setDeviceType("");
      alert("디바이스가 등록되었습니다.");
      console.log("Device Added");
    } catch (error) {
      console.error("Error fetching device type:", error);
      setQrScanError("QR 코드 스캔에 실패했습니다.");
    }
  };

  const handleError = (err) => {
    setQrScanError(err.message);
  };

  const memoizedQrReader = useMemo(
    () => (
      <QrReader
        delay={300}
        style={{ width: "100%" }}
        onError={handleError}
        onScan={handleScan}
      />
    ),
    []
  );

  return (
    <div>
      <h4>QR 코드 스캔</h4>
      {memoizedQrReader}
      {qrScanError && <p>QR 코드 스캔 에러: {qrScanError}</p>}
    </div>
  );
};

export default QRScanner;
