import { useDispatch } from 'react-redux';
import { removeDevice } from '../states/deviceSlice'

const useRemoveDevice = () => {
  const dispatch = useDispatch();

  const removeDeviceHandler = async (publicKey) => {
    dispatch(removeDevice(publicKey))
  };
  return { removeDeviceHandler };
};

export default useRemoveDevice;
