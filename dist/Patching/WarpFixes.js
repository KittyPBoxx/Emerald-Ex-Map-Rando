function patchDuplicateWarps() {


    if(IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E")) {

        // (24,24,20, 24,24,23) -> 24,24,17
        // First Duplicate Warp in aquas hideout
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872b27c - 0x08000000, 0x32);

        // (24,24,9, 24,24,14, 24,24,21) -> 24,24,12
        // Second duplicate Warp in aquas hideout
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872B26D - 0x08000000, 0x33);
        // Thrid duplicate warp in team aquas hideout
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872B235 - 0x08000000, 0x34);

        // (24,24,7, 24,25,9) -> 24,24,4
        // Fourth duplicate warp in team aquas hideout
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872B379 - 0x08000000, 0x35);

        // (24,31,3, 24,28,0, 24,33,2) -> 24,27,1
        // Duplicate Warp in seafloor cavern
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872B751 - 0x08000000, 0x32);
        // Second Duplicate seafloor cavern warp
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x0872B839 - 0x08000000, 0x46);

    }

}