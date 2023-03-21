function patchGameIssues() {

    if(IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E")) {
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x9da34, 0x08);
    }

    // if(IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E")) {

    //     // Move route 116 tunnler from in front of house to help avoid progression locks
    //     IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0852a69c - 0x08000000, 0x25);

    //     // Patch Sidney Room to avoid softlock by auto walk  
    //     IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0842d53D - 0x08000000, 0x32);

    //     // Seafloor Cavern tide room prevent getting automatically pushed through the door
    //     IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x084378A4 - 0x08000000, 0x70);
    //     IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x084378A5 - 0x08000000, 0x11);

    // }

}
