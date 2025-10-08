import './App.css'
import GradientBlinds from '../src/components/GradientBlinds'

function App() {
  return (
    <>
    <div className='w-screen h-screen flex justify-center items-center bg-black'>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.3}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>
    </div>
    </>
  )
}

export default App
