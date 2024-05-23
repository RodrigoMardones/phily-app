import React from 'react'
import { useSelector } from 'react-redux'
import { getTree } from '../store/tree/slice'
import { Card } from 'react-daisyui'
import Dendrogram from '../dendrogram/dendrogram'
import ZoomableSVG from '../zoomable/zoomable'

const Canvas = () => {
  const [key, setKey] = React.useState(0)
  const { tree, normalize, curveType, name, angle, width, height } = useSelector(getTree)
  
  React.useEffect(() => {
    setKey(key + 1)
  }, [normalize, curveType, name, angle, angle, width, height]);

  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center items-center h-full">
          <ZoomableSVG>
            { name &&
            <Dendrogram
              key={key}
              data={tree}
              // parte de las dimenciones base de dibujo de un arbol
              // calcular el ancho y alto de la imagen en base a la cantidad de nodos
              // y la cantidad de niveles
              width={width}
              height={height}
              normalize={normalize}
              curveType={curveType}
              angle={angle}
            />}
          </ZoomableSVG>
      </div>
    </Card>
  )
}

export default Canvas
