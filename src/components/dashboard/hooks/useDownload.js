import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTree } from '../../store/tree/slice';
import { getFile } from '@/components/store/file/slice';

const buildSvgClone = () => {
  const gTree = document.querySelector('#dendrogram-g');
  if (!gTree) return null;
  const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const bbox = gTree.getBBox();
  const { x, y, width, height } = bbox;
  const scaleFactor = 0.25;
  newSvg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
  newSvg.setAttribute('width', width * scaleFactor);
  newSvg.setAttribute('height', height * scaleFactor);
  const clonedG = gTree.cloneNode(true);
  newSvg.appendChild(clonedG);
  clonedG.setAttribute('transform', `scale(${1})`);
  return { newSvg, width: width * scaleFactor, height: height * scaleFactor };
};

const dendrogramToBlob = () => {
  const result = buildSvgClone();
  if (!result) return null;
  const { newSvg } = result;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(newSvg);
  return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
};

const dendrogramToImageBlob = (fileType) => {
  const result = buildSvgClone();
  if (!result) return Promise.resolve(null);
  const { newSvg, width, height } = result;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(newSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(svgUrl);
        resolve(blob);
      }, `image/${fileType}`);
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      resolve(null);
    };
    img.src = svgUrl;
  });
};

const saveBlob = async (blob, defaultName, extension, mime) => {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${defaultName}.${extension}`,
        types: [
          {
            description: `${extension.toUpperCase()} file`,
            accept: { [mime]: [`.${extension}`] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  const fileName = window.prompt('Ingrese el nombre del archivo:', defaultName);
  if (!fileName) return;
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${fileName}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

const useDownload = () => {
  const tree = useSelector(getTree);
  let {name} = useSelector(getFile);
  name = name ? name.split('.')[0] : 'my-dendrogram';

  const [download, setDownload] = useState('png');
  const handleChangeSelectDownload = (e) => {
    e.preventDefault();
    setDownload(e.target.value);
  };
  const handleDownload = useCallback(async () => {
    if (download === 'json') {
      const json = JSON.stringify({ ...tree }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      await saveBlob(blob, name, download, 'application/json');
    } else if (download === 'svg') {
      const svgBlob = dendrogramToBlob();
      await saveBlob(svgBlob, name, 'svg', 'image/svg+xml');
    } else {
      const blob = await dendrogramToImageBlob(download);
      if (blob) {
        const mime = download === 'png' ? 'image/png' : `image/${download}`;
        await saveBlob(blob, name, download, mime);
      }
    }
  }, [download, tree, name]);

  return {
    download,
    handleChangeSelectDownload,
    handleDownload,
  };
};

export default useDownload;
