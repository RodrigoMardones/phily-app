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
      let treeSvg = document.querySelector('#dendrogram');
      const size = treeSvg.getBoundingClientRect();
      console.log("size inside download", size);
      toPng(treeSvg, {...basicConfig, width: size.width, height: size.height}).then((dataUrl) => {
        let link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      });
    }
    if (download === 'jpeg') {
      let treeSvg = document.querySelector('#dendrogram');
      const size = treeSvg.getBoundingClientRect();
      console.log("size inside download", size);
      toJpeg(treeSvg, {...basicConfig, width: size.width, height: size.height}).then((dataUrl) => {
        let link = document.createElement('a');
        link.download = `${fileName}.jpeg`;
        link.href = dataUrl;
        link.click();
      });
    }
    if (download === 'svg') {
      let treeSvg = document.querySelector('#dendrogram');
      const size = treeSvg.getBoundingClientRect();
      console.log("size inside download", size);
      toSvg(treeSvg, {...basicConfig, width: size.width, height: size.height}).then((dataUrl) => {
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
