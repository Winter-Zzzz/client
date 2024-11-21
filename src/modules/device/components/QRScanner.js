import React, { useState, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { addDevice } from "../states/deviceSlice";
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";

const QRScanner = () => {
  const dispatch = useDispatch();
  const qrRef = useRef(null);
  
  const [qrScanError, setQrScanError] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [lastRegisteredDevice, setLastRegisteredDevice] = useState(null);
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: "environment"
  });

  // ... handleScan, handleError, resetScanner 함수들은 동일

  const handleDeviceSubmit = () => {
    if (!deviceName || !publicKey) {
      alert("디바이스 이름을 입력해주세요.");
      return;
    }

    try {
      const newDevice = { 
        deviceType: deviceName,  // deviceSlice와의 호환성을 위해 deviceType 필드 사용
        publicKey 
      };
      dispatch(addDevice(newDevice));
      setLastRegisteredDevice(newDevice);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("디바이스 등록 에러:", error);
      setQrScanError("디바이스 등록에 실패했습니다.");
    }
  };

  // ... QrComponent는 동일

  return (
    <div>
      <h4>QR 코드 스캔</h4>
      
      {QrComponent}

      {qrScanError && (
        <p>QR 코드 스캔 에러: {qrScanError}</p>
      )}

      {!isScanning && !registrationSuccess && (
        <div>
          <div>
            <label>디바이스 이름</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="디바이스 이름을 입력하세요"  // placeholder 변경
            />
          </div>
          
          <button
            onClick={handleDeviceSubmit}
            disabled={!deviceName}
          >
            등록
          </button>
        </div>
      )}

      {registrationSuccess && lastRegisteredDevice && (
        <div>
          <h5>등록된 디바이스</h5>
          <p>이름: {lastRegisteredDevice.deviceType}</p>
          <button onClick={resetScanner}>
            새 디바이스 등록
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;