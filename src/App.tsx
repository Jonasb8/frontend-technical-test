import { useEffect, useState } from 'react'
import { Background, Controls, ReactFlow, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import './App.css'

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

// Style constants
const STYLES = {
  project: {
    backgroundColor: '#6366f1',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  challenge: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  },
  model: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    maxWidth: 180,
  },
}

// Position constants
const POSITIONS = {
  projectY: 50,
  challengeY: 200,
  modelY: 400,
  projectX: 400,
  challengeBaseX: 100,
  challengeSpacing: 600,
  modelBaseX: 50,
  modelSpacing: 200,
}

// Text truncation constants
const TEXT_LENGTHS = {
  challenge: 50,
  model: 40,
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

function buildGraphData(project: Project | null): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  if (!project) {
    return { nodes, edges }
  }

  // Add project node
  const projectNodeId = `project-${project.id}`
  nodes.push({
    id: projectNodeId,
    position: { x: POSITIONS.projectX, y: POSITIONS.projectY },
    data: { label: project.name },
    style: STYLES.project,
  })

  // Add challenge and model nodes
  project.technicalChallenges.forEach((challenge, challengeIndex) => {
    const challengeNodeId = `tc-${challenge.id}`
    const challengeLabel = `Challenge ${challenge.id}: ${truncateText(challenge.name, TEXT_LENGTHS.challenge)}`

    nodes.push({
      id: challengeNodeId,
      position: {
        x: POSITIONS.challengeBaseX + challengeIndex * POSITIONS.challengeSpacing,
        y: POSITIONS.challengeY,
      },
      data: { label: challengeLabel },
      style: STYLES.challenge,
    })

    edges.push({
      id: `e-project-${challengeNodeId}`,
      source: projectNodeId,
      target: challengeNodeId,
    })

    // Add biological model nodes
    challenge.biologicalModels.forEach((model, modelIndex) => {
      const modelNodeId = `bm-${model.id}`
      const modelLabel = `Model ${model.id}: ${truncateText(model.name, TEXT_LENGTHS.model)}`

      nodes.push({
        id: modelNodeId,
        position: {
          x: POSITIONS.modelBaseX + challengeIndex * POSITIONS.challengeSpacing + modelIndex * POSITIONS.modelSpacing,
          y: POSITIONS.modelY,
        },
        data: { label: modelLabel },
        style: STYLES.model,
      })

      edges.push({
        id: `e-${challengeNodeId}-${modelNodeId}`,
        source: challengeNodeId,
        target: modelNodeId,
      })
    })
  })

  return { nodes, edges }
}

export default function App() {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('https://technical-test-866419219838.europe-west3.run.app/projects/1')
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.statusText}`)
        }
        const data: Project = await response.json()
        setProject(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [])

  const { nodes, edges } = buildGraphData(project)

  if (isLoading) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading project data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
