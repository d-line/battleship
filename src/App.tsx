import './App.css'

export default function App() {

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center justify-between mb-4 border-solid border-2">
          <h1 className="text-2xl font-bold">Battleship — 1v1</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1 border-solid border-2">
            Ship Pallette
          </div>

          <div className="md:col-span-1 border-solid border-2">
            Your Board
          </div>

           <div className="md:col-span-1 border-solid border-2">
            Opponent Board
           </div>
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          <p>Drag a ship from the left palette onto your board. Use Rotate to switch orientation. Ready up to start.</p>
        </footer>
      </div>
    </div>
  )
}
