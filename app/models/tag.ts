export interface TagResonse extends Response {
  result: Result
}

export interface Result {
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  projectTags: any[]
  _count: Count
}

export interface Count {
  projectTags: number
}

export interface Meta {
  timestamp: string
}
