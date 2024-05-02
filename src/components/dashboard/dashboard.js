import React, { useState } from 'react'
import { Button, Card, FileInput } from 'react-daisyui'
import Image from 'next/image'
import { createBaseTree, parseStringToTree } from '@/utils/TreeData'
import Error from '../error/error'
import { tree } from 'd3'
const accepts = ['.nwk']

function Dashboard() {
  const [fileSelected, setFile] = useState({
    fileName: '',
    content: '',
  })
  const [treeCreated, setTree] = useState({
    treeName: '',
    tree: createBaseTree(),
  })
  let fileReader
  const [error, setError] = useState({
    message: '',
    open: false,
  })
  const handleFileRead = () => {
    setFile({
      fileName: fileReader.fileName,
      content: fileReader.result,
    })
  }
  const handleFileOnChange = (e) => {
    const files = e.target.files
    console.log(files)
    if (files?.length) {
      fileReader = new FileReader()
      fileReader.fileName = files[0].name
      fileReader.onloadend = handleFileRead
      fileReader.readAsText(files[0])
    }
  }
  const handleLoadClick = (e) => {
    /** USECASES */
    /**
     * 1. No file selected
     */
    e.preventDefault()
    console.log(fileSelected)
    if (!fileSelected.fileName) {
      setError({
        message: 'No se ha seleccionado un archivo',
        open: true,
      })
      return
    }
    /**
     * 2. File loaded twice
     */
    if (fileSelected.fileName === treeCreated.treeName) {
      setError({
        message: 'Se ha cargado el mismo archivo',
        open: true,
      })
      return
    }
    /**
     * 3. File loaded first time
     */
    const tree = parseStringToTree(fileSelected.content)
    setTree({
      treeName: fileSelected.fileName,
      tree: tree,
    })
  }

  return (
    <>
      <Card className="w-96 bg-primary p-4 rounded-none border-none">
        <Error message={error.message} open={error.open} setError={setError} />
        <div className="grid grid-cols-1">
          <div className="flex flex-row">
            <Image
              src="/tree.svg"
              width={86}
              height={82}
              className="bg-white"
            />
            <Card.Title className="text-white ml-2 items-end text-5xl">
              Phily-App
            </Card.Title>
          </div>
          <div className="flex flex-col mt-12">
            <Card.Title className="text-white items-end text-2xl">
              Subir Arbol
            </Card.Title>
            <form>
              <FileInput
                className="file-input file-input-bordered file-input-neutral file-input-sm w-full"
                placeholder="hola"
                onChange={handleFileOnChange}
                accept={accepts.join(',')}
              />
              <Button
                className="btn btn-accent mt-2 mr-2"
                onClick={handleLoadClick}
              >
                cargar
              </Button>
              <Button
                className="btn btn-secondary mt-2 mr-2"
                onClick={(e) => e.preventDefault()}
              >
                limpiar
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Dashboard
