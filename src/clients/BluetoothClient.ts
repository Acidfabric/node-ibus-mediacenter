import autoBind from 'auto-bind';
import dbus from 'dbus-next';

import { Base } from '../base';
import { GraphicsNavigationOutputDevice } from '../devices';
import { RemoteControlClient } from '../types';

interface BaseProperties<T> {
  signature: string;
  value: T;
}

interface TrackInfoProperties {
  Title: BaseProperties<string>;
  Artist: BaseProperties<string>;
  Album: BaseProperties<string>;
}

interface TrackProperties {
  Track: BaseProperties<TrackInfoProperties>;
}

interface StatusProperties {
  Status: BaseProperties<string>;
}

type Properties = TrackProperties | StatusProperties;

class BluetoothClient extends Base implements RemoteControlClient {
  private navOutput: GraphicsNavigationOutputDevice;
  private bus: dbus.MessageBus;
  private player?: dbus.ClientInterface;

  constructor(navOutput: GraphicsNavigationOutputDevice) {
    super('BluetoothClient');

    this.navOutput = navOutput;
    this.bus = dbus.systemBus();
    autoBind(this);

    this.init();
  }

  private async init() {
    const proxyObject = await this.bus.getProxyObject('org.bluez', '/');
    const objectManager = proxyObject.getInterface('org.freedesktop.DBus.ObjectManager');
    objectManager.on('InterfacesAdded', this.onInterfacesAdded);
  }

  private async onInterfacesAdded(path: string, interfaces: Record<string, string>) {
    const deviceProxyObject = await this.bus.getProxyObject('org.bluez', path);
    const properties = deviceProxyObject.getInterface('org.freedesktop.DBus.Properties');
    properties.on('PropertiesChanged', this.onPropertiesChanged);

    if ('org.bluez.MediaPlayer1' in interfaces) {
      this.player = deviceProxyObject.getInterface('org.bluez.MediaPlayer1');
    }
  }

  private onPropertiesChanged(intf: string, changed: Properties, _invalidated: string[]) {
    if ('org.bluez.MediaPlayer1' !== intf) return;

    if ('Track' in changed) {
      const { Title, Artist, Album } = changed.Track.value;
      this.logger.debug(`${Artist.value} - ${Title.value} [${Album.value}]`);
      this.navOutput.setTitle(`${Artist.value} - ${Title.value} [${Album.value}]`);
    }
  }

  public up(): void {
    this.player?.Next();
  }

  public down(): void {
    this.player?.Previous();
  }

  public left(): void {
    this.player?.Rewind();
  }

  public right(): void {
    this.player?.FastForward();
  }

  public select(): void {
    throw new Error('Method not implemented.');
  }

  public back(): void {
    throw new Error('Method not implemented.');
  }
}

export { BluetoothClient };
