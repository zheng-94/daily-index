// js library
mergeInto(LibraryManager.library, {
  send_packet_ptr_to_web: function (packet_ptr) {
    let $packetPtr = document.querySelector("#packet-ptr");
    $packetPtr.setAttribute("data-packetPtr", packet_ptr);
    return null;
  },
});
