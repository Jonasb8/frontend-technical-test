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

export default function App() {
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch('https://technical-test-866419219838.europe-west3.run.app/projects/1')
      .then(response => response.json())
      .then((data: Project) => {
        setProject(data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  const nodes: Node[] = []
  const edges: Edge[] = []

  if (project) {
    nodes.push({
      id: `project-${project.id}`,
      position: { x: 400, y: 50 },
      data: { label: project.name },
      style: { backgroundColor: '#6366f1', color: 'white', padding: 10, borderRadius: 5 }
    })

    project.technicalChallenges.forEach((tc, tcIndex) => {
      const tcId = `tc-${tc.id}`
      nodes.push({
        id: tcId,
        position: { x: 100 + tcIndex * 600, y: 200 },
        data: { label: `Challenge ${tc.id}: ${tc.name.substring(0, 50)}...` },
        style: { backgroundColor: '#f59e0b', color: 'white', padding: 10, borderRadius: 5, maxWidth: 300 }
      })

      edges.push({
        id: `e-project-${tcId}`,
        source: `project-${project.id}`,
        target: tcId,
      })

      tc.biologicalModels.forEach((bm, bmIndex) => {
        const bmId = `bm-${bm.id}`
        nodes.push({
          id: bmId,
          position: { x: 50 + tcIndex * 600 + bmIndex * 200, y: 400 },
          data: { label: `Model ${bm.id}: ${bm.name.substring(0, 40)}...` },
          style: { backgroundColor: '#10b981', color: 'white', padding: 10, borderRadius: 5, maxWidth: 180 }
        })

        edges.push({
          id: `e-${tcId}-${bmId}`,
          source: tcId,
          target: bmId,
        })
      })
    })
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