/* ==========================================================
   Task scenes: short looping animations (8 s) of Tova doing each chore.
   Same art direction as the hero robot: the same shapes, gradients and tokens
   (gShell, gDark, gArm, gMetal and rTorsoClip are defined in the hero SVG).

   How it works: each scene places the robot, then gives the gripper a target
   to pick from and one to place on (in scene pixels). A two-joint inverse
   kinematics solver turns those targets into shoulder and elbow angles,
   and CSS keyframes play the loop. The object is drawn three times:
   at the source, in the gripper (only while carried), and at the destination.
   ========================================================== */
(function () {
  var W = 640, H = 400;
  var S = 0.46;                    // robot scale in the scene
  var RX = 110, RY = 20;           // robot offset in the scene
  var SH = { x: 428, y: 326 };     // right shoulder, robot units
  var L1 = 140, L2 = 199;          // upper arm and forearm (to the gripper centre), robot units
  var GRIP_Y = SH.y + L1 + L2;     // gripper centre when the arm hangs straight down
  var DUR = 8;                     // seconds per loop
  var FLOOR = 357;

  function toRobot(p) { return { x: (p.x - RX) / S, y: (p.y - RY) / S }; }

  // Inverse kinematics: target in scene px -> [shoulder deg, elbow deg] (0 = hanging down)
  function ik(p) {
    var t = toRobot(p);
    var dx = t.x - SH.x, dy = t.y - (SH.y + 0);
    var d = Math.min(Math.hypot(dx, dy), L1 + L2 - 2);
    var base = Math.atan2(-dx, dy);
    var a = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
    var b = Math.PI - Math.acos((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2));
    var deg = 180 / Math.PI;
    return [(base - a) * deg, b * deg];   // elbow bends outward and down, like the hero arm
  }

  function kf(name, stops) {
    return '@keyframes ' + name + '{' + stops.map(function (s) { return s[0] + '%{' + s[1] + '}'; }).join('') + '}';
  }
  function rot(v) { return 'transform:rotate(' + v.toFixed(1) + 'deg)'; }
  function op(v) { return 'opacity:' + v; }

  /* ---------- Shared drawings (scene px) ---------- */
  var items = {
    can: function (x, y) {
      return '<g><rect class="sc-item-a" x="' + (x - 11) + '" y="' + (y - 15) + '" width="22" height="30" rx="3"/>' +
        '<rect class="sc-item-b" x="' + (x - 11) + '" y="' + (y - 5) + '" width="22" height="10"/>' +
        '<rect class="sc-paper" x="' + (x - 9) + '" y="' + (y - 15) + '" width="18" height="3" rx="1.5"/></g>';
    },
    block: function (x, y) {
      return '<g><rect class="sc-item-c" x="' + (x - 13) + '" y="' + (y - 13) + '" width="26" height="26" rx="4"/>' +
        '<circle class="sc-dark" cx="' + x + '" cy="' + y + '" r="5"/></g>';
    },
    bottle: function (x, y) {
      return '<g><rect class="sc-item-a" x="' + (x - 9) + '" y="' + (y - 14) + '" width="18" height="36" rx="5"/>' +
        '<rect class="sc-item-a" x="' + (x - 4) + '" y="' + (y - 24) + '" width="8" height="12" rx="2"/>' +
        '<rect class="sc-item-b" x="' + (x - 5) + '" y="' + (y - 27) + '" width="10" height="5" rx="2"/>' +
        '<rect class="sc-paper" x="' + (x - 9) + '" y="' + (y + 0) + '" width="18" height="10"/></g>';
    },
    plate: function (x, y) {
      return '<g><rect class="sc-paper" x="' + (x - 22) + '" y="' + (y - 3) + '" width="44" height="6" rx="3"/>' +
        '<rect class="sc-cream" x="' + (x - 14) + '" y="' + (y - 3) + '" width="28" height="2" rx="1"/></g>';
    },
    plateUp: function (x, y) {
      return '<g><rect class="sc-paper" x="' + (x - 3) + '" y="' + (y - 20) + '" width="6" height="40" rx="3"/></g>';
    },
    shirt: function (x, y) {
      return '<path class="sc-item-a" d="M' + (x - 8) + ' ' + (y - 4) + ' L' + (x - 22) + ' ' + (y + 4) + ' L' + (x - 17) + ' ' + (y + 14) +
        ' L' + (x - 12) + ' ' + (y + 11) + ' L' + (x - 12) + ' ' + (y + 34) + ' L' + (x + 12) + ' ' + (y + 34) + ' L' + (x + 12) + ' ' + (y + 11) +
        ' L' + (x + 17) + ' ' + (y + 14) + ' L' + (x + 22) + ' ' + (y + 4) + ' L' + (x + 8) + ' ' + (y - 4) + ' Q' + x + ' ' + (y + 2) + ' ' + (x - 8) + ' ' + (y - 4) + ' Z"/>';
    },
    folded: function (x, y) {
      return '<g><rect class="sc-item-a" x="' + (x - 22) + '" y="' + (y - 6) + '" width="44" height="12" rx="3"/>' +
        '<rect class="sc-olive-dark" x="' + (x - 22) + '" y="' + (y - 1) + '" width="44" height="2"/></g>';
    },
    jug: function (x, y) {
      return '<g><path class="sc-paper" d="M' + (x - 13) + ' ' + (y - 16) + ' L' + (x + 13) + ' ' + (y - 16) + ' L' + (x + 13) + ' ' + (y + 22) +
        ' Q' + (x + 13) + ' ' + (y + 26) + ' ' + (x + 9) + ' ' + (y + 26) + ' L' + (x - 9) + ' ' + (y + 26) + ' Q' + (x - 13) + ' ' + (y + 26) + ' ' + (x - 13) + ' ' + (y + 22) + ' Z"/>' +
        '<path class="sc-paper" d="M' + (x - 13) + ' ' + (y - 16) + ' L' + (x - 20) + ' ' + (y - 22) + ' L' + (x - 9) + ' ' + (y - 16) + ' Z"/>' +
        '<rect class="sc-cream" x="' + (x - 11) + '" y="' + (y + 4) + '" width="22" height="20" rx="3"/></g>';
    }
  };

  function window_(x, y) {
    return '<g class="sc-line"><rect x="' + x + '" y="' + y + '" width="86" height="110" rx="6"/><path d="M' + (x + 43) + ' ' + y + ' V' + (y + 110) + ' M' + x + ' ' + (y + 55) + ' H' + (x + 86) + '"/></g>';
  }
  function clock(x, y) {
    return '<g class="sc-line"><circle cx="' + x + '" cy="' + y + '" r="26"/><path d="M' + x + ' ' + y + ' V' + (y - 16) + ' M' + x + ' ' + y + ' H' + (x + 11) + '"/></g>';
  }
  function frame(x, y) {
    return '<g class="sc-line"><rect x="' + x + '" y="' + y + '" width="76" height="58" rx="4"/><path d="M' + (x + 8) + ' ' + (y + 50) + ' L' + (x + 30) + ' ' + (y + 26) + ' L' + (x + 46) + ' ' + (y + 40) + ' L' + (x + 56) + ' ' + (y + 30) + ' L' + (x + 68) + ' ' + (y + 50) + '"/></g>';
  }

  /* ---------- The scenes ---------- */
  var scenes = [
    { // 0. Unloading groceries: from the bag to the shelf
      item: 'can', pick: { x: 372, y: 286 }, place: { x: 430, y: 118 },
      back: window_(24, 70),
      props: function () {
        return '<rect class="sc-furn" x="335" y="302" width="305" height="55"/><rect class="sc-edge" x="335" y="300" width="305" height="5"/>' +
          '<rect class="sc-edge" x="392" y="134" width="248" height="5"/><rect class="sc-furn" x="392" y="139" width="248" height="10"/>' +
          items.can(476, 118) + items.can(504, 118) + items.can(560, 118) +
          '<rect class="sc-cream" x="384" y="230" width="10" height="56" rx="5" transform="rotate(14 389 258)"/>' +
          '<path class="sc-paper-dark" d="M344 256 L400 256 L404 302 L340 302 Z"/>';
      },
      front: function () {   // bag front hides the bottom of the can inside
        return '<path class="sc-paper" d="M340 276 L348 270 L356 276 L364 270 L372 276 L380 270 L388 276 L396 270 L404 276 L404 302 L340 302 Z"/>' +
          '<rect class="sc-paper-dark" x="340" y="286" width="64" height="2"/>' +
          items.can(410, 286) ;
      }
    },
    { // 1. Tidying up: toy from the stool into the toy box
      item: 'block', pick: { x: 366, y: 289 }, place: { x: 432, y: 232 }, drop: { x: 432, y: 284 },
      back: frame(30, 80),
      props: function () {
        return '<rect class="sc-furn" x="340" y="302" width="54" height="8" rx="3"/><rect class="sc-edge" x="346" y="310" width="6" height="47"/><rect class="sc-edge" x="382" y="310" width="6" height="47"/>' +
          '<rect class="sc-furn-dark" x="398" y="262" width="96" height="10"/>' +
          '<circle class="sc-item-b" cx="476" cy="268" r="11"/>' +
          items.block(560, 344) + '<circle class="sc-item-c" cx="596" cy="346" r="10"/>';
      },
      front: function () {
        return '<rect class="sc-furn" x="398" y="268" width="96" height="89" rx="4"/><rect class="sc-item-b" x="398" y="290" width="96" height="6"/>';
      }
    },
    { // 2. Fetching from the fridge: bottle from the shelf to the side table
      item: 'bottle', pick: { x: 446, y: 140 }, place: { x: 370, y: 288 },
      back: clock(80, 110),
      props: function () {
        return '<rect class="sc-furn" x="414" y="58" width="158" height="299" rx="10"/>' +
          '<rect class="sc-fridge" x="424" y="70" width="138" height="276" rx="6"/>' +
          '<rect class="sc-edge" x="424" y="162" width="138" height="4"/><rect class="sc-edge" x="424" y="240" width="138" height="4"/>' +
          '<rect class="sc-item-c" x="500" y="128" width="22" height="34" rx="3"/><rect class="sc-item-b" x="528" y="140" width="20" height="22" rx="10"/>' +
          '<rect class="sc-item-a" x="440" y="206" width="30" height="34" rx="4"/><rect class="sc-paper" x="480" y="216" width="40" height="24" rx="4"/>' +
          '<path class="sc-furn-dark" d="M572 64 L612 82 L612 336 L572 352 Z"/>' +
          '<rect class="sc-furn" x="338" y="311" width="66" height="7" rx="3"/><rect class="sc-edge" x="344" y="318" width="6" height="39"/><rect class="sc-edge" x="392" y="318" width="6" height="39"/>';
      }
    },
    { // 3. Loading dishes: plate from the counter into the top rack
      item: 'plate', placed: 'plateUp', pick: { x: 422, y: 230 }, place: { x: 384, y: 300 }, drop: { x: 384, y: 302 },
      back: window_(24, 60),
      props: function () {
        return '<rect class="sc-edge" x="392" y="243" width="248" height="6"/><rect class="sc-furn" x="400" y="249" width="240" height="108"/>' +
          items.plate(422, 240) +
          '<rect class="sc-furn-dark" x="510" y="262" width="110" height="80" rx="4"/><rect class="sc-edge" x="530" y="272" width="70" height="4" rx="2"/>' +
          '<rect class="sc-furn-dark" x="332" y="324" width="146" height="10" rx="3"/>' +
          items.plateUp(360, 302) + items.plateUp(408, 302) + items.plateUp(428, 302) + items.plateUp(448, 302) +
          '<path class="sc-wire" d="M338 322 H472 M338 322 V300 M472 322 V300 M338 300 H472 M350 322 V310 M370 322 V310 M396 322 V310 M418 322 V310 M438 322 V310 M458 322 V310"/>';
      }
    },
    { // 4. Folding clothes: T-shirt from the basket, folded onto the table
      item: 'shirt', placed: 'folded', pick: { x: 366, y: 284 }, place: { x: 440, y: 214 }, drop: { x: 440, y: 232 },
      back: frame(30, 70),
      props: function () {
        return '<rect class="sc-furn" x="398" y="238" width="220" height="7" rx="3"/><rect class="sc-edge" x="408" y="245" width="7" height="112"/><rect class="sc-edge" x="600" y="245" width="7" height="112"/>' +
          items.folded(540, 232) + items.folded(540, 220) + items.folded(540, 208) +
          '<path class="sc-item-a" d="M344 300 Q366 280 390 300 Z"/>';
      },
      front: function () {
        return '<path class="sc-basket" d="M338 298 H396 L390 357 H344 Z"/><path class="sc-line" d="M344 312 H390 M346 326 H388 M348 340 H386"/>';
      }
    },
    { // 5. Pouring ingredients: flour into the bowl on the scale
      pour: true, item: 'jug', hold: { x: 420, y: 190 },
      back: clock(80, 100),
      props: function () {
        return '<rect class="sc-furn" x="336" y="302" width="304" height="55"/><rect class="sc-edge" x="336" y="300" width="304" height="5"/>' +
          '<rect class="sc-furn-dark" x="348" y="288" width="76" height="12" rx="3"/><rect class="sc-lime" x="372" y="291" width="28" height="6" rx="2"/>' +
          '<path class="sc-paper" d="M556 236 L600 236 L604 300 L552 300 Z"/><rect class="sc-paper-dark" x="560" y="258" width="40" height="18"/>';
      },
      front: function () {
        return '<path class="sc-bowl" d="M354 262 H418 Q416 290 386 290 Q356 290 354 262 Z"/>';
      }
    }
  ];

  /* ---------- Robot (robot units; arms are built from the IK angles) ---------- */
  function jaws(sx, cls) {
    return '<g class="' + cls + '-jl" style="transform-origin:' + (sx - 6) + 'px 614px"><path class="f-metal" d="M' + (sx - 10) + ' 612 C' + (sx - 32) + ' 634 ' + (sx - 36) + ' 672 ' + (sx - 16) + ' 698 L' + (sx - 6) + ' 692 C' + (sx - 20) + ' 670 ' + (sx - 18) + ' 642 ' + sx + ' 626 Z"/></g>' +
      '<g class="' + cls + '-jr" style="transform-origin:' + (sx + 6) + 'px 614px"><path class="f-metal" d="M' + (sx + 10) + ' 612 C' + (sx + 32) + ' 634 ' + (sx + 36) + ' 672 ' + (sx + 16) + ' 698 L' + (sx + 6) + ' 692 C' + (sx + 20) + ' 670 ' + (sx + 18) + ' 642 ' + sx + ' 626 Z"/></g>';
  }
  function bolts5(cx, cy, d, r) {
    return '<circle class="f-bolt" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(function (o) { return '<circle class="f-bolt" cx="' + (cx + o[0] * d) + '" cy="' + (cy + o[1] * d) + '" r="' + r + '"/>'; }).join('');
  }
  function armParts(sx, held, cls, tY) {
    // drawn hanging straight down from the shoulder; the groups rotate it
    return '<g class="' + cls + '-u" style="transform-origin:' + sx + 'px 326px">' +
      '<rect class="f-arm" x="' + (sx - 20) + '" y="336" width="40" height="124" rx="14"/>' +
      '<g class="' + cls + '-f" style="transform-origin:' + sx + 'px 466px">' +
        '<rect class="f-arm" x="' + (sx - 18) + '" y="470" width="36" height="116" rx="12"/>' +
        '<rect class="f-recess" x="' + (sx - 10) + '" y="500" width="20" height="40" rx="4"/>' +
        '<g class="' + cls + '-t" style="transform-origin:' + sx + 'px ' + (tY || 600) + 'px">' +
          (held || '') +
          '<rect class="f-plate" x="' + (sx - 24) + '" y="584" width="48" height="30" rx="8"/>' +
          jaws(sx, cls) +
        '</g>' +
      '</g>' +
      '<rect class="f-plate" x="' + (sx - 22) + '" y="444" width="44" height="44" rx="12"/>' + bolts5(sx, 466, 11, 2.6) +
    '</g>';
  }
  function robot(cls, held, tY) {
    return '<g transform="translate(' + RX + ' ' + RY + ') scale(' + S + ')">' +
      '<ellipse class="r-shadow" cx="280" cy="742" rx="150" ry="14"/>' +
      '<rect class="f-dside" x="174" y="685" width="224" height="52" rx="26"/><rect class="f-dark" x="168" y="680" width="224" height="52" rx="26"/>' +
      '<rect class="f-plate" x="196" y="688" width="168" height="5" rx="2.5"/>' +
      '<rect class="f-arm" x="262" y="484" width="36" height="204" rx="6"/><rect class="f-arm" x="254" y="252" width="52" height="52" rx="8"/>' +
      // left arm: relaxed
      '<g transform="rotate(6 132 326)">' + armParts(132, '', cls + 'L') + '</g>' +
      // right arm: does the work
      armParts(SH.x, held, cls, tY) +
      // torso
      '<g transform="translate(6 5)" clip-path="url(#rTorsoClip)"><rect class="f-side" x="150" y="296" width="260" height="84"/><rect class="f-dside" x="150" y="380" width="260" height="116"/></g>' +
      '<g clip-path="url(#rTorsoClip)"><rect class="f-shell" x="150" y="296" width="260" height="84"/><rect class="f-dark" x="150" y="380" width="260" height="116"/></g>' +
      '<rect class="f-plate" x="271" y="395" width="18" height="18" rx="5"/><circle class="f-accent sc-core" cx="280" cy="404" r="5"/>' +
      '<circle class="f-bolt" cx="176" cy="424" r="5"/><circle class="f-bolt" cx="384" cy="424" r="5"/><circle class="f-bolt" cx="176" cy="470" r="5"/><circle class="f-bolt" cx="384" cy="470" r="5"/>' +
      '<rect class="f-plate" x="106" y="300" width="52" height="56" rx="12"/>' + bolts5(132, 328, 12, 2.8) +
      '<rect class="f-plate" x="402" y="300" width="52" height="56" rx="12"/>' + bolts5(428, 328, 12, 2.8) +
      // head: turns toward what it is looking at
      '<g class="' + cls + '-h">' +
        '<rect class="f-arm" x="138" y="150" width="26" height="76" rx="10"/><rect class="f-arm" x="396" y="150" width="26" height="76" rx="10"/>' +
        '<rect class="f-side" x="166" y="75" width="240" height="190" rx="16"/><rect class="f-shell" x="160" y="70" width="240" height="190" rx="16"/>' +
        '<rect class="f-dark" x="172" y="80" width="216" height="38" rx="6"/>' +
        '<circle class="f-plate" cx="184" cy="91" r="2.6"/><circle class="f-plate" cx="376" cy="91" r="2.6"/>' +
        '<rect class="f-screen" x="268" y="86" width="24" height="20" rx="4"/><circle class="r-lens" cx="280" cy="96" r="5"/>' +
        '<circle class="sc-light" cx="304" cy="96" r="3.5"/>' +
        '<rect class="f-screen" x="178" y="128" width="204" height="112" rx="14"/>' +
        '<g class="' + cls + '-e"><rect class="sc-eye" x="236" y="156" width="26" height="56" rx="13"/><rect class="sc-eye" x="298" y="156" width="26" height="56" rx="13"/></g>' +
      '</g>' +
    '</g>';
  }

  /* ---------- Keyframes for one scene ---------- */
  function css(i, sc) {
    var c = 'sc' + i, rest = [-4, 8], jc = 0, jh = 6, jo = 22, out = [];
    var anim = function (sel, name, timing) {
      return '.scene-' + i + ' .' + sel + '{animation:' + name + ' ' + DUR + 's ' + (timing || 'ease-in-out') + ' infinite}';
    };
    var look = function (p) { return 'transform:translate(' + Math.max(-12, Math.min(14, (p.x - 290) / 10)).toFixed(1) + 'px,' + Math.max(-8, Math.min(8, (p.y - 200) / 14)).toFixed(1) + 'px)'; };
    var A, B;
    if (sc.pour) {
      A = ik(sc.hold);
      out.push(kf(c + 'u', [[0, rot(rest[0])], [10, rot(rest[0])], [26, rot(A[0])], [74, rot(A[0])], [88, rot(rest[0])], [100, rot(rest[0])]]));
      out.push(kf(c + 'f', [[0, rot(rest[1])], [10, rot(rest[1])], [26, rot(A[1])], [74, rot(A[1])], [88, rot(rest[1])], [100, rot(rest[1])]]));
      // the gripper tilts the jug; keep the jug's spout pointing at the bowl
      var up = -(A[0] + A[1]), tilt = up - 100;   // jug upright while moving, then tipped toward the bowl
      out.push(kf(c + 't', [[0, rot(0)], [10, rot(0)], [26, rot(up)], [34, rot(up)], [44, rot(tilt)], [62, rot(tilt)], [72, rot(up)], [74, rot(up)], [88, rot(0)], [100, rot(0)]]));
      out.push(kf(c + 'm', [[0, 'transform:scaleY(0);opacity:1'], [48, 'transform:scaleY(0);opacity:1'], [64, 'transform:scaleY(1);opacity:1'], [90, 'transform:scaleY(1);opacity:1'], [97, 'transform:scaleY(1);opacity:0'], [100, 'transform:scaleY(0);opacity:0']]));
      out.push(kf(c + 's', [[0, 'opacity:0;transform:scaleY(0)'], [45.9, 'opacity:0;transform:scaleY(0)'], [46, 'opacity:1;transform:scaleY(0)'], [50, 'opacity:1;transform:scaleY(1)'], [60, 'opacity:1;transform:scaleY(1)'], [61, 'opacity:0;transform:scaleY(1)'], [100, 'opacity:0;transform:scaleY(0)']]));
      out.push(kf(c + 'd', [[0, 'opacity:0'], [47.9, 'opacity:0'], [48, 'opacity:1'], [63.9, 'opacity:1'], [64, 'opacity:0'], [100, 'opacity:0']]));
      out.push(kf(c + 'h', [[0, 'transform:none'], [14, 'transform:none'], [28, look(sc.hold)], [76, look(sc.hold)], [90, 'transform:none'], [100, 'transform:none']]));
      out.push(anim(c + '-t', c + 't'), anim('sc-mound', c + 'm'), anim('sc-stream', c + 's', 'linear'), anim('sc-readout', c + 'd', 'linear'));
    } else {
      A = ik(sc.pick); B = ik(sc.place);
      var mid = [(A[0] + B[0]) / 2 - 10, (A[1] + B[1]) / 2 + 12];   // lift a little between pick and place
      out.push(kf(c + 'u', [[0, rot(rest[0])], [10, rot(rest[0])], [28, rot(A[0])], [36, rot(A[0])], [46, rot(mid[0])], [56, rot(B[0])], [64, rot(B[0])], [84, rot(rest[0])], [100, rot(rest[0])]]));
      out.push(kf(c + 'f', [[0, rot(rest[1])], [10, rot(rest[1])], [28, rot(A[1])], [36, rot(A[1])], [46, rot(mid[1])], [56, rot(B[1])], [64, rot(B[1])], [84, rot(rest[1])], [100, rot(rest[1])]]));
      // keep the gripper roughly upright so the object hangs naturally
      var keep = function (a) { return rot(-(a[0] + a[1]) * 0.7); };
      out.push(kf(c + 't', [[0, rot(0)], [10, rot(0)], [28, keep(A)], [36, keep(A)], [46, keep(mid)], [56, keep(B)], [64, keep(B)], [84, rot(0)], [100, rot(0)]]));
      ['jl', 'jr'].forEach(function (j, n) {
        var s = n ? -1 : 1;
        out.push(kf(c + j, [[0, rot(jc)], [14, rot(jc)], [26, rot(s * jo)], [31, rot(s * jo)], [35, rot(s * jh)], [58, rot(s * jh)], [62, rot(s * jo)], [70, rot(s * jo)], [82, rot(jc)], [100, rot(jc)]]));
        out.push(anim(c + '-' + j, c + j));
      });
      out.push(kf(c + 'held', [[0, op(0)], [33.9, op(0)], [34, op(1)], [60.9, op(1)], [61, op(0)], [100, op(0)]]));
      out.push(kf(c + 'src', [[0, op(1)], [33.9, op(1)], [34, op(0)], [90, op(0)], [97, op(1)], [100, op(1)]]));
      var drop = sc.drop ? { x: sc.place.x - sc.drop.x, y: sc.place.y - sc.drop.y } : { x: 0, y: 0 };
      var from = 'transform:translate(' + drop.x + 'px,' + drop.y + 'px)';
      out.push(kf(c + 'dst', [[0, op(0) + ';' + from], [60.9, op(0) + ';' + from], [61, op(1) + ';' + from], [66, op(1) + ';transform:none'], [90, op(1) + ';transform:none'], [96, op(0) + ';transform:none'], [100, op(0) + ';transform:none']]));
      out.push(kf(c + 'h', [[0, 'transform:none'], [12, 'transform:none'], [24, look(sc.pick)], [38, look(sc.pick)], [50, look(sc.place)], [64, look(sc.place)], [82, 'transform:none'], [100, 'transform:none']]));
      out.push(anim(c + '-t', c + 't'), anim('sc-held', c + 'held', 'linear'), anim('sc-src', c + 'src', 'linear'), anim('sc-dst', c + 'dst', 'ease-in'));
    }
    out.push(anim(c + '-u', c + 'u'), anim(c + '-f', c + 'f'), anim(c + '-h', c + 'h'));
    out.push(kf(c + 'e', [[0, 'transform:scaleY(1)'], [74, 'transform:scaleY(1)'], [75.5, 'transform:scaleY(.1)'], [77, 'transform:scaleY(1)'], [100, 'transform:scaleY(1)']]));
    out.push(anim(c + '-e', c + 'e', 'linear'));
    return out.join('\n');
  }

  function render(i, label) {
    var sc = scenes[i], c = 'sc' + i;
    var draw = items[sc.item];
    // object as carried: centred on the gripper, drawn in scene px inside the robot's scaled space
    var held = '<g class="' + (sc.pour ? '' : 'sc-held') + '" transform="translate(' + SH.x + ' ' + (GRIP_Y + 8) + ') scale(' + (1 / S).toFixed(4) + ')">' + draw(0, sc.pour ? 8 : 4) + '</g>';
    var body = '';
    if (sc.pour) {
      var bx = 384, by = 262, sy = 240;   // stream from the tipped spout down into the bowl
      body += '<rect class="sc-stream" x="' + (bx - 2) + '" y="' + sy + '" width="5" height="' + (by - sy) + '" rx="2.5" style="transform-origin:' + bx + 'px ' + sy + 'px"/>' +
        '<ellipse class="sc-mound sc-cream" cx="386" cy="266" rx="26" ry="9" style="transform-origin:386px 272px"/>' +
        '<text class="sc-readout" x="386" y="296.5" text-anchor="middle">250 g</text>';
    } else {
      var placed = items[sc.placed || sc.item];
      var dst = sc.drop || sc.place;
      body += '<g class="sc-src">' + draw(sc.pick.x, sc.pick.y + 4) + '</g>' +
        '<g class="sc-dst">' + placed(dst.x, dst.y + (sc.placed ? 0 : 4)) + '</g>';
    }
    return '<svg class="scene scene-' + i + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label.replace(/"/g, '&quot;') + '">' +
      '<rect class="sc-floor" x="0" y="' + FLOOR + '" width="' + W + '" height="' + (H - FLOOR) + '"/>' +
      '<rect class="sc-base" x="0" y="' + FLOOR + '" width="' + W + '" height="2"/>' +
      sc.back + sc.props() + body + robot(c, held, sc.pour ? GRIP_Y + 36 : 600) + (sc.front ? sc.front() : '') +
    '</svg>';
  }

  // Inject the keyframes once
  var style = document.createElement('style');
  style.id = 'sceneKeyframes';
  style.textContent = scenes.map(function (sc, i) { return css(i, sc); }).join('\n');
  document.head.appendChild(style);

  window.TovaScenes = { count: scenes.length, render: render, duration: DUR * 1000 };
})();
