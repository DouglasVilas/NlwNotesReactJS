import * as  Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content : string) => void
  }
  let speechRecognition: SpeechRecognition | null = null


export function NewNoteCard({onNoteCreated} :NewNoteCardProps) {
    const [shouldSkowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event : ChangeEvent<HTMLTextAreaElement>){
        setContent(event.target.value)
        
        if (event.target.value === ''){
            setShouldShowOnboarding(true)
        }
    }
    function handleSaveNote(event: FormEvent){
       
        if(content === ""){
            return
        }
       
        event.preventDefault()    // tira o padrao do formulario 
       
        onNoteCreated(content)
        setContent ('')
        setShouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')


    }
     function handleStartRecording() {
        const isSpeechRecognitionAPIAvailabre = "SpeechRecognition" in window
        || "webkitSpeechRecognition" in window

        if(!isSpeechRecognitionAPIAvailabre){
            alert ("Infelizmente seu navegador não suporta a API de gravação!!!")
            return
        }
        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        const SpeechRecognition  = new SpeechRecognitionAPI 
            SpeechRecognition.lang = 'pt-BR'
            SpeechRecognition.continuous = true
            SpeechRecognition.maxAlternatives = 1  //Talvez a api nao entendem sua fala ele vai trazer so um resultado que ele acha que e
            SpeechRecognition.interimResults = true
            
            SpeechRecognition.onresult = (event) => {
              const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)

              }, '')
                
              setContent(transcription) //e para fazer a api escrever o texto gravando a voz
            }

            SpeechRecognition.onerror =(event) => {
                console.error(event)
            }
            SpeechRecognition.start()   //para iniciar a gravacao 
     }
     function handleStopRecording() {
        setIsRecording(false)

        if(speechRecognition !== null) {
            speechRecognition.stop()

        }
    }
    
    return(
        <Dialog.Root>

            <Dialog.Trigger className="rounder-md flex flex-col  bg-slate-700 text-left p-5 gap-3  hover:ring-2 outline-none hover:ring-white focus:ring-2 focus:ring-lime-400">
                <span className="text-sm dont-medium text-slate-200">
                    Adicionar nota
                </span>

                <p className="text-sn leading-6 text-slate-400">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>
        
           <Dialog.Portal>

            <Dialog.Overlay className='inset-0 fixed bg-black/50'/>   {/* Responsavel para deixar a tela escura para destacar o que você clicou  */}
            <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full h-[60vh] bg-slate-700 md:rounder-md flex flex-col outline-none' >
            <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                <X className= 'size-5'/>
                
            </Dialog.Close>
            <form className = "flex-1 flex flex-col">
            
                <div className='flex flex-1 flex-col gap-3 p-5s'>
                    <span className="text-sm font-medium text-slate-300">
                        Adicionar nota
                  
                    </span>
                        
                        {/* if e else  */}
                    {shouldSkowOnboarding ? (

                    <p className='text-sm leading-6 text-slate-400'>
                        Comece <button type="button" onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'  > gravando uma nota </button> em áudio ou se preferir <button  type="button" onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
                    </p>    
                ) :(
                   <textarea
                   autoFocus
                   className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                   onChange={handleContentChanged}
                   value={content}
                   />

                )}
                </div>


            {isRecording ? (

                <button 
                type="button"
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                >
                    <div className='size-3 rounded-full bg-red-500 animate-pulse'/> 
                    Gravando! ( clique p/ interromper)            
                </button>
            ) : (
                <button 
                type="button"
                onClick={handleSaveNote}
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'
                >
                    Salvar Nota
            
                </button>
            )}

            </form>
 
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )

}