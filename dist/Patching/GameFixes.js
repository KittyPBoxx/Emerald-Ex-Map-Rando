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

        // Patch Wallace Waterfall text to say 'Gymsign'
        let GYM_SIGN = [0xc1, 0xd3, 0xc7, 0xcd, 0xc3, 0xc1, 0xc8];
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 0, GYM_SIGN[0]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 1, GYM_SIGN[1]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 2, GYM_SIGN[2]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 3, GYM_SIGN[3]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 4, GYM_SIGN[4]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 5, GYM_SIGN[5]);
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x20EE77 + 6, GYM_SIGN[6]);
    }

}
