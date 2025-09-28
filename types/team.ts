export interface TeamMember {
  id: number
  name: string
  role: 'coordinator' | 'researcher' | 'student' | 'technician' | 'collaborator'
  bio?: string
  photoUrl?: string
  email?: string
  lattesUrl?: string
  orcid?: string
  researchAreas?: string[]
  education?: string
  experience?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMemberFormData {
  name: string
  role: 'coordinator' | 'researcher' | 'student' | 'technician' | 'collaborator'
  bio?: string
  photoUrl?: string
  email?: string
  lattesUrl?: string
  orcid?: string
  researchAreas?: string[]
  education?: string
  experience?: string
}