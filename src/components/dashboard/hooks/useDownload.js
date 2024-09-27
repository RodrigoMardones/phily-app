import { toJpeg, toPng, toSvg } from 'html-to-image';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTree } from '../../store/tree/slice';

const useDownload = () => {
  const tree = useSelector(getTree);
  const {width, height} = tree;
  const [download, setDownload] = useState('png');
  const handleChangeSelectDownload = (e) => {
    e.preventDefault();
    setDownload(e.target.value);
  };
  const basicConfig = { width: 1000, height: 1000, quality: 1 };
  const handleDownload = useCallback(() => {
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
      const newTree = document.querySelector('#dendrogram-svg');
      const size = newTree.getBoundingClientRect();
      const gTree = newTree.querySelector('#dendrogram-g');
      const gSize = gTree.getBoundingClientRect();
  

      // si gSize.top es negativo se sale de los limites
      // si gSize.left es 
      const config = {
        width: size.width + gSize.width,
        height: size.height + gSize.height
      }
      toPng(newTree,config).then((dataUrl) => {
        let link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      });
    }
    if (download === 'jpeg') {
      const newTree = document.querySelector('#dendrogram-svg');
      const size = newTree.getBoundingClientRect();
      const gTree = newTree.querySelector('#dendrogram-g');
      const gSize = gTree.getBoundingClientRect();
  

      // si gSize.top es negativo se sale de los limites
      // si gSize.left es 
      const config = {
        width: size.width + gSize.width,
        height: size.height + gSize.height
      }
      toJpeg(newTree, config).then((dataUrl) => {
        let link = document.createElement('a');
        link.download = `${fileName}.jpeg`;
        link.href = dataUrl;
        link.click();
      });
    }
    if (download === 'svg') {
      const newTree = document.querySelector('#dendrogram-svg');
      const size = newTree.getBoundingClientRect();
      const gTree = newTree.querySelector('#dendrogram-g');
      const gSize = gTree.getBoundingClientRect();
  

      // si gSize.top es negativo se sale de los limites
      // si gSize.left es 
      const config = {
        width: size.width + gSize.width,
        height: size.height + gSize.height
      }

      toSvg(newTree, {
        ...basicConfig,
        ...config
      }).then((dataUrl) => {
        let link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = dataUrl;
        link.click();
      });
    }
  }, [download, tree]);

  return {
    download,
    handleChangeSelectDownload,
    handleDownload,
  };
};

export default useDownload;
