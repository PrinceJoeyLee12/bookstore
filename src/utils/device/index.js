import { Device } from '@capacitor/device';

export const getDeviceId = async () => {
  const id = await Device.getId();
  return id || '';
};
