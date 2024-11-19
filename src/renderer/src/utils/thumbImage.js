


export const thumbImageBufferToBase64 = (target) => {
    if (!target) {
      return '';
    }

    const url  = URL.createObjectURL(
      new Blob([target.buffer], { type: 'image/png' } /* (1) */)
    );
    return url;
    //
    return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
  
    canvas.width = target.width;
    canvas.height = target.height
    const width = canvas.width;
    const height = canvas.height;
  
    const rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
      const srow = row;
      const imageData = ctx.createImageData(width, 1);
      const start = srow * width * 4;
      for (let i = 0; i < rowBytes; ++i) {
        imageData.data[i] = target.buffer[start + i];
      }
      ctx.putImageData(imageData, 0, row);
    }
  
    return canvas.toDataURL('image/png');
  };
  