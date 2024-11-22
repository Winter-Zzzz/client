import React, { useState, useMemo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addDevice } from '../states/deviceSlice'
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";

const DeviceNameModal = ({ onSubmit, onCancel }) => {
  const [deviceName, setDeviceName] = useState("");

  const handleSubmit = () => {
    if (deviceName.trim()) {
      onSubmit(deviceName);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>디바이스 이름 입력</h3>
        <p>스캔된 디바이스의 이름을 입력해주세요.</p>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="디바이스 이름을 입력하세요"
          autoFocus
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={!deviceName.trim()}>
            확인
          </button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

const AddDevicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const [qrScanError, setQrScanError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [deviceType, setDeviceType] = useState("");
  const [manualPublicKey, setManualPublicKey] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  const stopCamera = () => {
    if (qrRef.current && qrRef.current.el) {
      const stream = qrRef.current.el.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  const startCamera = () => {
    setIsScanning(true);
    setDeviceInfo(null);
  };

  const handleScan = async (data) => {
    if (data && isScanning) {
      try {
        const uint8Data = new Uint8Array(data.text.length);
        for (let i = 0; i < data.text.length; i++) {
          uint8Data[i] = data.text.charCodeAt(i);
        }

        const info = JSON.parse(MatterTunnel.extractDeviceInfo(uint8Data));
        console.log("스캔된 디바이스 정보:", info);
        
        stopCamera();
        setIsScanning(false);
        setDeviceInfo(info);
        setShowModal(true);

      } catch (error) {
        console.error("QR 스캔 에러:", error);
        setQrScanError("QR 코드 처리 중 오류가 발생했습니다: " + error.message);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR 스캔 에러:", err);
    setQrScanError(err.message);
  };

  const handleDeviceNameSubmit = (name) => {
    if (deviceInfo) {
      dispatch(
        addDevice({
          deviceType: name,
          publicKey: deviceInfo.publicKey,
        })
      );
      alert("디바이스가 등록되었습니다.");
      navigate("/device");
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    startCamera();
    setDeviceInfo(null);
  };

  const onPublicKeyChange = useCallback((e) => {
    setManualPublicKey(e.target.value);
    setDeviceType("");
  }, []);

  const onTypeChange = useCallback((e) => setDeviceType(e.target.value), []);

  const onAddDeviceClick = useCallback(() => {
    if (manualPublicKey && deviceType) {
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
  }, [deviceType, manualPublicKey, dispatch, navigate]);

  const QRComponent = useMemo(() => (
    <div>
      {isScanning ? (
        <QrReader
          ref={qrRef}
          delay={300}
          onError={handleError}
          onScan={handleScan}
        />
      ) : (
        <div>
          <p>QR 코드 인식 완료!</p>
          {!showModal && (
            <input
              type="text"
              value={deviceType}
              onChange={onTypeChange}
              placeholder="디바이스 이름을 입력하세요"
            />
          )}
          <button onClick={startCamera}>다시 스캔</button>
        </div>
      )}
      {qrScanError && <p>{qrScanError}</p>}
    </div>
  ), [isScanning, qrScanError, deviceType, onTypeChange, showModal]);

  return (
    <section>
      <div>
        <h2>디바이스 추가</h2>
        <button onClick={() => navigate(-1)}>✕</button>
      </div>

      <p>
        QR 코드를 스캔하거나, <br />
        디바이스 코드를 입력해 주세요.
      </p>

      <form>
        {QRComponent}

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
              placeholder="디바이스 이름을 입력하세요"
            />
          )}
        </div>

        {manualPublicKey && deviceType && (
          <Link to="/device">
            <button
              type="button"
              onClick={onAddDeviceClick}
              disabled={!deviceType || !manualPublicKey}
            >
              등록
            </button>
          </Link>
        )}
      </form>

      {showModal && (
        <DeviceNameModal
          onSubmit={handleDeviceNameSubmit}
          onCancel={handleModalCancel}
        />
      )}
    </section>
  );
};

export default AddDevicePage;