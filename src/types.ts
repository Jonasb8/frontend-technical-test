interface BiologicalModel {
  id: number
  name: string
}

interface TechnicalChallenge {
  id: number
  name: string
  biologicalModels: BiologicalModel[]
}

interface Project {
  id: number
  name: string
  technicalChallenges: TechnicalChallenge[]
}
