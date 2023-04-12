# Emerald Speedchoice Ex map rando

This is a custom emulator mod for playing Emerald Ex Speedchoice with random warps and speedup hacks [Go To The Emulator](https://kittypboxx.github.io/Emerald-Ex-Map-Rando/build)

**PLEASE REPORT ANY BUGS IN THE ISSUES SECTION**

---

## Setup

1. Legally backup a copy of *Emerald (U)* [^1]
2. Download the xdelta patch for emerald speedchoice ex [here](https://github.com/ProjectRevoTPP/pokeemerald-ex-speedchoice/releases/tag/0.4.0). 
3. Use a [rom patcher](https://www.marcrobledo.com/RomPatcher.js/) to apply the patch to a copy of your Emerald (U).
4. Open [the emulator](https://kittypboxx.github.io/Emerald-Ex-Map-Rando/build) in [Chrome](https://www.google.com/intl/en_uk/chrome/) (**Edge is not supported**) 
5. Load the rom and press 'start'

ESC (or long swipe down) will bring up the emulation menu where you can change things like the seed.

<br>
[^1] (md5sum 605b89b67018abcea91e693a4dd25be3)

---

## Notes

There are some differences in this randomizer compared to the universal warp randomizer. Here are some things to be aware of: 

- Game mode: Game should be played in 'CEA' mode with 'Plotless' set to 'Full'. No early surf.
- 'Escape' in menu to avoid any softlocking: 
    - Menu option available anywhere outside the safari zone
    - Indoors / In Caves it works the same as an escape rope (normally last place outdoors)
    - Outside / Underwater it takes you back to Oldale
    - Sometimes, after the screen fades to black, a 'B' input is needed to load the new map.
- Speed Hacks: By default speed hacks are 'Always On'. This runs the game at a faster speed while audio remains normal. 
    - Speed Hacks can be set 'on', 'off' or 'battle only' so only battles are speed up <BR>
    - Normal Emulator Speedup is also available. Both can be toggled with a keybind. <BR>
    - Speed hacks cause some screen tearing, makes fishing frame perfect and cause lag during hall of fame / credits loading. 
- Some warp inclusions/exclusions are different:
    - Added: 
        - Lilycove Art Museum
        - Slateport Dock 
        - Jagged Pass Emblem Door
        - Route 125 Shoal Cave Enterance
        - Ex Exclusive Cave Sootopolis (Right Of Origin)
        - Outside of safari zone
        - Trainer Hill Enterance
    - Removed :
        - Seafloor cavern tide room with centre cave
        - Most floors inside cave of origin
- Progression Changes
    - Norman/Wattson completable out-of-order without causing softlock. (Badge order should still be possible in logic) <BR>
    - Entering Normans gym unlocks left of Petalburg (even without doing the catch tutorial)
    - Delivering letter to steven in granite gave unlocks Slateport -> Mauville
    - Waterfall can be obtained by talking to the Sootopolis Gym sign if Wallace is not there
    - Sootopolis gym door always unlocked
    - Magma Emblem always available by talking to old couple on Mt Pyer (even after teams defeated)
    - Dive is never needed in the progression logic (although it might speed things up)
    - Rayquaza can be caught on first visit to Sky Pillar (No need to go back to Sootopolis)
- Misc
    - Darkness is removed from all caves (but not Brawly's gym)

- KNOWN GLITCHES 
    - Overworld sprites breaking if certain legendaries like Rayquaza or Hoho are first in the party
        
---

## Credits

### Randomizer Coding - `KittyPBoxx`
<br>
IodineGBA (the core emulator) was created by Grant Galitz (taisel) <br>
A list of people who worked on Emerald Ex Speedchoice can be found:

[here](https://github.com/ProjectRevoTPP/pokeemerald-ex-speedchoice/graphs/contributors)<br>

<br/>

The Source Code for the project can be found at [https://github.com/KittyPBoxx/Emerald-Ex-Map-Rando](https://github.com/KittyPBoxx/Emerald-Ex-Map-Rando)

---

## Licence 

MIT License (MIT)

Copyright © 2022, [KittyPBoxx](https://github.com/KittyPBoxx/).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Search

As various terms such as pokemon combo map randomizer, combo warp randomizer, crossover map randomizer e.t.c are used interchangeably some people have had issues finding the repository. For this reason I've started added in alternate terms such as map randomiser, multigame map randomizer and Fire Red + Emerald map randomizer to help people find this when using different search terms.
