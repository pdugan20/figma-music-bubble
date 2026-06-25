export interface RGB {
  r: number
  g: number
  b: number
}

export interface TrackEntry {
  trackName: string
  artistName: string
  artworkUrl: string
  dominantColor: RGB | null
}

export interface SelectionStatus {
  ok: boolean
  message: string
}

export interface PopulateMessage {
  type: 'populate'
  trackName: string
  artistName: string
  artworkBytes: number[] | null
  dominantColor: RGB | null
}

export interface SelectionMessage {
  type: 'selection'
  status: SelectionStatus
}
