import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addDevice } from '../states/deviceSlice'
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";

const AddDevicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qrScanError, setQrScanError] = useState("");
  const [showDeviceNameInput, setShowDeviceNameInput] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [deviceType, setDeviceType] = useState("");
  const [manualPublicKey, setManualPublicKey] = useState("");

  // QR 코드 스캔 처리
  const handleScan = async (data) => {
    if (data) {
      try {
        // Latin1 문자열을 Uint8Array로 변환
        const uint8Data = new Uint8Array(data.text.length);
        for (let i = 0; i < data.text.length; i++) {
          uint8Data[i] = data.text.charCodeAt(i);
        }

        // 디바이스 정보 추출
        const info = JSON.parse(MatterTunnel.extractDeviceInfo(uint8Data));
        console.log("스캔된 디바이스 정보:", info);
        setDeviceInfo(info);
        setShowDeviceNameInput(true);
      } catch (error) {
        console.error("QR 스캔 에러:", error);
        setQrScanError("QR 코드 처리 중 오류가 발생했습니다: " + error.message);
      }
    }
  };

  // QR 스캔 에러 처리
  const handleError = (err) => {
    console.error("QR 스캔 에러:", err);
    setQrScanError(err.message);
  };

  // 디바이스 등록 처리
  const onAddDeviceClick = useCallback(() => {
    if (deviceInfo && deviceType) {
      dispatch(
        addDevice({
          deviceType: deviceType,
          publicKey: deviceInfo.publicKey,
        })
      );
      setDeviceType("");
      alert("디바이스가 등록되었습니다.");
      navigate("/device");
    } else if (manualPublicKey && deviceType) {
      dispatch(
        addDevice({
          deviceType: deviceType,
          publicKey: manualPublicKey,
        })
      );
      setDeviceType("");
      setManualPublicKey("");
      alert("디바이스가 등록되었습니다.");
      navigate("/device");
    }
  }, [deviceInfo, deviceType, manualPublicKey, dispatch, navigate]);

  // 디바이스 타입 변경 핸들러
  const onTypeChange = useCallback((e) => setDeviceType(e.target.value), []);

  // 수동 입력 공개키 변경 핸들러
  const onPublicKeyChange = useCallback((e) => setManualPublicKey(e.target.value), []);

  // QR 스캐너 메모이제이션
  const memoizedQrReader = useMemo(
    () => (
      <QrReader
        delay={300}
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
        onError={handleError}
        onScan={handleScan}
      />
    ),
    []
  );

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2>디바이스 추가</h2>
        <button onClick={() => navigate(-1)}>✕</button>
      </div>

      <p>
        QR 코드를 스캔하거나, <br />
        디바이스 코드를 입력해 주세요.
      </p>

      <form>
        <div>
          {memoizedQrReader}
          {qrScanError && <p style={{ color: "red" }}>{qrScanError}</p>}
          {showDeviceNameInput && (
            <input
              type="text"
              id="deviceType"
              name="deviceType"
              value={deviceType}
              onChange={onTypeChange}
              placeholder="디바이스 타입을 입력하세요"
            />
          )}
        </div>

        <div>
          <h4>디바이스 코드 입력</h4>
          <input
            type="text"
            id="publicKey"
            name="publicKey"
            value={manualPublicKey}
            placeholder="디바이스 코드를 입력해주세요."
            onChange={onPublicKeyChange}
          />
          {manualPublicKey && (
            <input
              type="text"
              value={deviceType}
              onChange={onTypeChange}
              placeholder="디바이스 타입을 입력하세요"
            />
          )}
        </div>

        <Link to="/device">
          <button
            type="button"
            onClick={onAddDeviceClick}
            disabled={!deviceType || (!deviceInfo && !manualPublicKey)}
          >
            등록
          </button>
        </Link>
      </form>
    </section>
  );
};

export default AddDevicePage;