import React from 'react';

const useProject = () => {

  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch('https://technical-test-866419219838.europe-west3.run.app/projects/1')
      .then(response => response.json())
      .then((data: Project) => {
        setProject(data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

};

export default useProject;