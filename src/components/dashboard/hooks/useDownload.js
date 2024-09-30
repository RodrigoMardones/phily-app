import { toJpeg, toPng, toSvg } from 'html-to-image';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTree } from '../../store/tree/slice';

const useDownload = () => {
  const tree = useSelector(getTree);
  const [download, setDownload] = useState('png');
  const handleChangeSelectDownload = (e) => {
    e.preventDefault();
    setDownload(e.target.value);
  };
  const handleDownload = useCallback(async () => {
    const fileName = 'my-dendrogram';
    if (download === 'json') {
      const json = JSON.stringify({ ...tree }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
    if (download === 'png') {
      const originalTree = document.querySelector('#dendrogram-svg');
      const gTree = originalTree.querySelector('#dendrogram-g');
      const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // Obtener las coordenadas de los límites del contenido del <g>
      const bbox = gTree.getBBox();
      const { x, y, width, height } = bbox;

      // Ajustar el viewBox y el tamaño del nuevo SVG
      const scaleFactor = 0.25; // Ajusta este valor según sea necesario
      newSvg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      newSvg.setAttribute('width', width * scaleFactor);
      newSvg.setAttribute('height', height * scaleFactor);
      // Clonar el elemento <g> y añadirlo al nuevo SVG
      const clonedG = gTree.cloneNode(true);
      newSvg.appendChild(clonedG);
      clonedG.setAttribute('transform', `scale(${1})`);

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(newSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Crear un canvas y dibujar el SVG en él
      const canvas = document.createElement('canvas');
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext('2d');

      // Rellenar el canvas con un fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);

        // Convertir el canvas a una URL de datos PNG
        const pngUrl = canvas.toDataURL('image/png');

        // Crear un enlace de descarga
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = pngUrl;
        document.body.append(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = svgUrl;
    }
    if (download === 'jpeg') {
      const originalTree = document.querySelector('#dendrogram-svg');
      const gTree = originalTree.querySelector('#dendrogram-g');
      const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // Obtener las coordenadas de los límites del contenido del <g>
      const bbox = gTree.getBBox();
      const { x, y, width, height } = bbox;

      // Ajustar el viewBox y el tamaño del nuevo SVG
      const scaleFactor = 0.25; // Ajusta este valor según sea necesario
      newSvg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      newSvg.setAttribute('width', width * scaleFactor);
      newSvg.setAttribute('height', height * scaleFactor);
      // Clonar el elemento <g> y añadirlo al nuevo SVG
      const clonedG = gTree.cloneNode(true);
      newSvg.appendChild(clonedG);
      clonedG.setAttribute('transform', `scale(${1})`);
      // Crear un canvas y dibujar el SVG en él
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(newSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Crear un canvas y dibujar el SVG en él
      const canvas = document.createElement('canvas');
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext('2d');

      // Rellenar el canvas con un fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);

        // Convertir el canvas a una URL de datos PNG
        const pngUrl = canvas.toDataURL('image/jpeg');

        // Crear un enlace de descarga
        const link = document.createElement('a');
        link.download = `${fileName}.jpeg`;
        link.href = pngUrl;
        document.body.append(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = svgUrl;
    }
    if (download === 'svg') {
      const originalTree = document.querySelector('#dendrogram-svg');
      const gTree = originalTree.querySelector('#dendrogram-g');
      const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // Obtener las coordenadas de los límites del contenido del <g>
      const bbox = gTree.getBBox();
      const { x, y, width, height } = bbox;

      // Ajustar el viewBox y el tamaño del nuevo SVG
      const scaleFactor = 0.25; // Ajusta este valor según sea necesario
      newSvg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      newSvg.setAttribute('width', width * scaleFactor);
      newSvg.setAttribute('height', height * scaleFactor);
      // Clonar el elemento <g> y añadirlo al nuevo SVG
      const clonedG = gTree.cloneNode(true);
      newSvg.appendChild(clonedG);
      clonedG.setAttribute('transform', `scale(${1})`);
      console.log(newSvg)
      // Convertir el nuevo SVG a una URL de datos
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(newSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.download = `${fileName}.svg`;
      link.href = svgUrl;
      document.body.append(link);
      link.click();
      document.body.removeChild(link);

      // Liberar la URL de datos
      URL.revokeObjectURL(svgUrl);
    }
  }, [download, tree]);

  return {
    download,
    handleChangeSelectDownload,
    handleDownload,
  };
};

export default useDownload;
