export function saveImagesToIndexedDB(images) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("RaffleStorage", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("images", "readwrite");
      const store = tx.objectStore("images");

      // ✅ Clear store before adding new files
      store.clear().onsuccess = () => {
        images.forEach((file) => {
          store.add({
            name: file.name,
            type: file.type,
            blob: file
          });
        });
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

  
export function getImagesFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("RaffleStorage", 1);

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("images", "readonly");
      const store = tx.objectStore("images");

      const files = [];
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = function (e) {
        const cursor = e.target.result;
        if (cursor) {
          const { name, type, blob } = cursor.value;
          const file = new File([blob], name, { type });
          files.push(file);
          cursor.continue();
        } else {
          resolve(files);
        }
      };

      cursorRequest.onerror = () => reject(cursorRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
}

  