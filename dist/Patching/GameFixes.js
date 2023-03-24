function patchGameIssues() {

    if(IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E")) {
        // Disable cave darkness
        // TODO: this only disables darkness on map loading from warp (not if loading from a save)
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0x9da34, 0x08);

        // Add in the ability to warp home
        IodineGUI.Iodine.IOCore.cartridge.cartriges.get("E").patchROM8(0xb9fc6, 0x01);

    }

}
