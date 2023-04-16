function patchGameIssues() {

    if(IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E")) {
        // Disable cave darkness
        // TODO: this only disables darkness on map loading from warp (not if loading from a save)
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x9da34, 0x08);

        // Add in the ability to warp home
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0xb9fc6, 0x01);

        // Make waterfall available from the gym sign
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d25C, 0x17);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d25D, 0xd8);

        // Make sure archie will never block off the gym
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d1b8, 0x20);

        // Make the guy from the top of sootopolis stand in front of the gym
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0B0, 0x1c);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0B2, 0x23);

        // Stop the guy moving around
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0B5, 0x01);

        // Make the guy from top of sootopolis give waterfall 
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0BC, 0x17);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0BD, 0xd8);
        
        // Make the guy from top of sootopolis dress like wallace
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x71d0AD, 0x85);
    }

}
