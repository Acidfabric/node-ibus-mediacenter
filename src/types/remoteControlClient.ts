export interface RemoteControlClient {
  up(): void;
  down(): void;
  left(): void;
  right(): void;
  select(): void;
  back(): void;
}
