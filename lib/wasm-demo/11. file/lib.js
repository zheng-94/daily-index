// js library
mergeInto(LibraryManager.library, {
  set_ptr: function (sizePtr, timePtr, dataPtr) {  
    let $sizePtr = document.querySelector('#size-ptr');
    $sizePtr.textContent = sizePtr;
    let $timePtr = document.querySelector('#time-ptr');
    $timePtr.textContent = timePtr;
    let $dataPtr = document.querySelector('#data-ptr');
    $dataPtr.textContent = dataPtr;

    return 1;
  },
});
