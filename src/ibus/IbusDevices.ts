import { interfaces } from '../constants';

function getDeviceName(key: string) {
  const hkey = parseInt(key, 16);
  const data = Object.entries(interfaces).filter(([_key, value]) => value === hkey);

  if (!data.length) return 'Unknown Device' + ' - ' + key;

  return data[0][0] + ' - ' + hkey;
}

const IbusDevices = { getDeviceName };
export { IbusDevices };
