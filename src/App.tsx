import Layout from './components/Layout'
import Sidebar from './components/Sidebar/Sidebar'
import Canvas from './components/Canvas/Canvas'
import CodePanel from './components/CodePanel/CodePanel'

export default function App() {
  return (
    <Layout
      sidebar={<Sidebar />}
      canvas={<Canvas />}
      codePanel={<CodePanel />}
    />
  )
}
