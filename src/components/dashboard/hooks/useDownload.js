import { toPng } from 'html-to-image';
import React, { useState } from 'react'

const useDownload = () => {
  const [download, setDownload] = useState('png');
  
  const handleChangeSelectDownload = (e) => {
    e.preventDefault();
    setDownload(e.target.value);
  };

  const handleDownload = () => {

    if (download === 'json') {
      const fileName = 'dendrogram';
      const json = JSON.stringify(tree.tree, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
    if (download === 'png') {
      let treeSvg = document.querySelector('#treeSvg')
      toPng(treeSvg)
        .then((dataUrl) => {
          let link = document.createElement('a');
          link.download = 'tree.png';
          link.href = dataUrl;
          link.click()
        })
    }
  };

  return {
    download,
    handleChangeSelectDownload,
    handleDownload
  }
}

export default useDownload