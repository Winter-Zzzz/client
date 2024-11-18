import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeDevice } from '../states/deviceSlice'

const RemoveDevice = ({ onCancel }) => {
    const devices = useSelector((state) => state.device);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);

    const handleCheckboxChange = (publicKey) => {
        setSelected((prev) =>
            prev.includes(publicKey)
                ? prev.filter((key) => key !== publicKey)
                : [...prev, publicKey]
        );
    };

    const handleDelete = () => {
        selected.forEach((publicKey) => {
            dispatch(removeDevice(publicKey)); // Redux 액션 호출
        });
        setSelected([]); // 선택 초기화
        onCancel(); // 삭제 모드 종료
    };

    return (
        <div>
            {devices.map((device) => (
                <article key={device.publicKey}>
                    <input
                        type="checkbox"
                        checked={selected.includes(device.publicKey)}
                        onChange={() => handleCheckboxChange(device.publicKey)}
                    />
                    <h4>{device.publicKey}</h4>
                    <p>{device.deviceType}</p>
                </article>
            ))}
            <button onClick={handleDelete} disabled={selected.length === 0}>
                선택한 기기 삭제하기
            </button>
            <button onClick={onCancel}>삭제 취소</button>
        </div>
    );
};

export default RemoveDevice;
