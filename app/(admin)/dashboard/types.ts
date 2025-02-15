export interface Root {
  systemStats: SystemStats;
  connectivity: Connectivity;
}

export interface SystemStats {
  server: string;
  cpu: Cpu;
  memory: Memory;
  disk: Disk;
  network: Network;
  uptime: Uptime;
}

export interface Cpu {
  name: string;
  model: string;
  usage: number;
  cores: number;
  load: number[];
}

export interface Memory {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  totalReadable: string;
  usedReadable: string;
  freeReadable: string;
}

export interface Disk {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  totalReadable: string;
  usedReadable: string;
  freeReadable: string;
}

export interface Network {
  incoming: number;
  outgoing: number;
  interfaces: Interfaces;
}

export interface Interfaces {
  additionalProp1: AdditionalProp1;
  additionalProp2: AdditionalProp2;
  additionalProp3: AdditionalProp3;
}

export interface AdditionalProp1 {
  rx_bytes: number;
  tx_bytes: number;
}

export interface AdditionalProp2 {
  rx_bytes: number;
  tx_bytes: number;
}

export interface AdditionalProp3 {
  rx_bytes: number;
  tx_bytes: number;
}

export interface Uptime {
  days: number;
  hours: number;
  minutes: number;
}

export interface Connectivity {
  isReachable: boolean;
  pingDetails: string;
  lastChecked: string;
}
