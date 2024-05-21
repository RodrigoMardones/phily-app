import React from 'react'
import { useSelector } from 'react-redux'
import { getTree } from '../store/tree/slice'
import { Card } from 'react-daisyui'
import Dendrogram from '../dendrogram/dendrogram'
import ZoomableSVG from '../zoomable/zoomable'

const Canvas = () => {
  const { tree, normalize, curveType, name, angle } = useSelector(getTree)
  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center items-center h-full">
        {name && (
          <ZoomableSVG>
            <Dendrogram
              data={tree}
              // parte de las dimenciones base de dibujo de un arbol
              // calcular el ancho y alto de la imagen en base a la cantidad de nodos
              // y la cantidad de niveles
              width={900}
              height={900}
              normalize={normalize}
              curveType={curveType}
            />
          </ZoomableSVG>
        )}
        
      </div>
    </Card>
  )
}

export default Canvas
