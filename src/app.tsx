import logo from './assets/Logo.svg'
import { NoteCard } from './componentes/note-card'
import { NewNoteCard } from './componentes/new-note-card'
import {  ChangeEvent, useState } from 'react'

interface Note {
  id: string 
  date : Date 
  content : string
}
export function App() {


 const [search, setSearch] = useState('')
 const [notes, setNotes] = useState<Note[]>(() => {  //nesta caso deve informar qual dados se tratado
  const notesOnStorage = localStorage.getItem('notes')
    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
      return[]
    
 }) 
 
 function onNoteCreated(content:string){
    const newNote = {
      id: crypto.randomUUID(),   // Cria o id unico nunca repetido 
      date: new Date(),
      content,
    }


    setNotes([newNote, ...notes])
    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray)) //Para salvar dados na tela

}


function onNoteDeleted(id:string){
  const notesArray = notes.filter(note =>{
    return note.id !== id
  })
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))

}



    function handleSearch (event: ChangeEvent <HTMLInputElement>){
      const query = event.target.value
      setSearch(query)
    }

  const filteredNotes = search !==  " "
    ? notes.filter (note => note.content.toLowerCase().includes(search.toLocaleLowerCase()))
    :notes

    return (
      <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 ">
        <img src={logo} alt= "NLW EXPERT" />
        
        <form className="w-full">
          <input 
            type="text" 
            placeholder="Busque em suas notas..."
             className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500" /*tracking-tight:basicamente deixa a letra mais perto da outra*/
          onChange={handleSearch}
          />
        </form>

        <div className="h-px bg-slate-700"/>
         

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated = {onNoteCreated} />

        {filteredNotes.map(note => {
            return <NoteCard key={note.id} note = {note} onNoteDeleted ={onNoteDeleted}/>
        })
        }

        </div>
      </div>

    ) 
}
