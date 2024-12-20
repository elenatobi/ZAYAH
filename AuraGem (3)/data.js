const data = `
- Natural sciences/Naturvetenskap:
  - Mathematics/Matematik:
    - $S Algebra:
      - $T Expansion and factorization:
        - 1[x+(y+z)=x+y+z]
        - 2[x(y+z)=xy+xz]
    - $S Geometry
    - $S Analytic Geometry
    - $S Statistics
    - $S Trigonometry
    - $S Calculus
    - $S Linear algebra
    - $S Game theory
  - Physics/Fysik:
    - $S Astronomy/Astronomi
    - $S Rigid body mechanics/Stel mekanik
    - $S Fluid mechanics/Strömningsmekanik
    - $S Electricity and magnetism/Elektricitet och magnetism
    - $S Thermodynamics/Termodynamik
    - $S Waves/Vågor
    - $S Nuclear physics/Kärnfysik
    - $S Quantum mechanics/Kvantfysik
  - Chemistry/Kemi:
    - $S Symbols/Symboler:
      - $T Color/Färg:
        - TRA[Transparent/Genomskinlig]
        - GRA[Grey/Grå]
        - BLA[Black/Svart]
        - BRO[Brown/Brun]
        - SIL[Silver/Silver]
        - YEL[Yellow/Gul]
        - LYE[Light_yellow/Ljusgul]
        - GRE[Green/Grön]
        - WHI[White/Vit]
        - RED[Red_Red/Röd]
        - ORA[Orange_color/Orange]
        - BLU[Blue_color/Blå]
      - $T Odor/Lukt:
        - .[Odorless/Luktlös]
        - F[Faint_odor/Svag_lukt]
        - M[Mild_odor/Mild_lukt]
        - P[Penetrating_odor/Genomträngade_lukt]
        - U[Pungent_odor/Stickande_lukt]
        - S[Sweet/Sackarossmak]
        - B[Burning_taste/Brännande_smak]
      - $T Structure/Struktur:
        - L[Lightest/Lättast]
        - H[Heavy/Tung]
        - V[Viscous/Viskös]
        - O[Oily/Oljig]
        - W[Heavy_vapors/Tunga_ånger]
        - N[Shiny/Glänsande]
        - S[Solid/Fast]
        - C[Crystal_form/Kristallform]
        - A[Highly_volatile/Lättflyktig]
        - I[Viscous/Trögflytande]
        - F[Fumigant/Rykande]
      - $T Reactivity/Reaktivitet:
        - .[Most_common/Vanligast]
        - F[Flammable/Brandfarlig]
        - H[Highly_flammable/Lättbrinnande]
        - E[Explosive/Explosiv]
        - S[Stable/Stabil]
        - C[Corrosive/Frätande]
        - R[Reactive/Reaktiv]
        - O[Combustible/Brännbar]
        - L[Light-sensitive/Ljuskänslig]
        - U[Unstable/Instabil]
      - $T Toxicity/Toxicitet:
        - .[Toxic/Giftig]
        - C[Carcinogenic/Cancerframkallande]
        - D[Dizziness/Yrsel]
        - N[Dullness/Dåsighet]
        - T[Tiredness/Trötthet]
        - V[Vomiting/Kräkningar]
        - N[Nauseating/Illamående]
        - O[Confusing/Förvirring]
        - A[Arrhythmias/Arytmier]
        - U[Unconsciousness/Medvetlöshet]
        - L[Lung_inflamation/Lunginflammation]
        - R[Respiration_system_damages/Andningsskada]
        - E[Liver_damages/Leverskada]
        - K[Kidney_damages/Njurskada]
        - B[Celebral~Neural_damages/Neurala_skador]
        - I[Irritating/Irriterande]
        - G[Allergy/Allergi]
    - $S Regular chemistry:
      - $T Periodic table/Periodiska systemet:
        - _[MAS(u) ELE MLt BLT ELA 1IZ(kJ/mol) RAD(Cal) RAD(Emp) RAD(Cov) HAR(Brinell) DEN(STP) DEN(Liquid) TCO ECO SPH VAH FUH COF]
        - 1H  [1.008 2.20 -259.1 -252.9 72.8 1312.0 53 25 25 - 0.0899 - 0.1805 - 14300 0.452 0.558 1s1]
        - 2He [4.002602 - - -269 0 2372.3 31 - - - 0.1785 - 0.1513 - 5193.1 0.083 0.02 1s2]
        - 3Li [6.94 0.98 180.54 1342 59.6 520.2 167 145 145 - 535 512 85 11 3570 147 3.0 1s2 2s1]
        - 4Be [9.012183 1.57 1287 2470 0 899.5 112 105 105 600 1848 1690 190 25 1820 297 7.95 1s2 2s2]
        - 5B  [10.81 2.04 2075 4000 26.7 800.6 87 85 85 - 2460 2080 27 1.0e-10 1030 507 50 2s2 2p1]
        - 6C  [12.011 2.55 3642 3642 153.9 1086.5 67 70 70 - 2260 - 140 0.10 710 715 105 2s2 2p2]
        - 7N  [14.007 3.04 -210.1 -195.8 7 1402.3 56 65 65 - 1.251 - 0.02583 - 1040 2.79 0.36 2s2 2p3]
        - 8O  [15.999 3.44 -218 -183 141 1313.9 48 60 60 - 1.429 - 0.02658 - 919 3.41 0.222 2s2 2p4]
        - 9F  [18.99840 3.98 -220 -188.1 328 1681.0 42 50 50 - 1.696 - 0.0277 - 824 3.27 0.26 2s2 2p5]
        - 10Ne[20.1797 - -248.6 -246.1 0 2080.7 38 - - - 0.900 - 0.0491 - 1030.0 1.75 0.34 2s2 2p6]
        - 11Na[22.98977 0.93 97.720 882.9 52.8 495.8 190 180 180 0.69 968 927 140 21 1230 97.7 2.60 2p6 3s1]
        - 12Mg[24.305 1.31 650 1090 0 737.7 145 150 150 260 1738 1584 160 23 1020 128 8.7 2p6 3s2]
        - 13Al[26.98154 1.61 660.32 2519 42.5 577.5 118 125 125 245 2700 2375 235 38 904 293 10.7 3s2 3p1]
        - 14Si[28.085 1.90 1414 2900 133.6 786.5 111 110 110 - 2330 2570 150 0.0010 710 359 50.2 3s2 3p2]
        - 15P [30.97376 2.19 44.15 280.5 72 1011.8 98 100 100 - 1823 - 0.236 10 769.7 12.4 0.64 3s2 3p3]
        - 16S [32.06 2.58 115.21 444.72 200 999.6 88 100 100 - 1960 1819 0.205 1.0e-21 705 9.8 1.73 3s2 3p4]
        - 17Cl[35.45 3.16 -101.5 -34.040 349 1251.2 79 100 100 - 3.214 - 0.0089 1.0e-8 478.2 10.2 3.2 3s2 3p5]
        - 18Ar[39.948 - -189 -186 0 1520.6 71 71 71 - 1.784 - 0.01772 - 520.33 6.5 1.18 3s2 3p6]
        - 19K [39.0983 0.82 63.380 758.9 48.4 418.8 243 220 220 0.363 856 828 100 14 757 76.9 2.33 3p6 4s1]
        - 20Ca[40.078 1.0 841.9 1484 2.37 589.8 194 180 180 167 1550 1378 200 29 631 155 8.54 3p6 4s2]
        - 21Sc[44.95591 1.36 1541 2830 18.1 633.1 184 160 160 750 2985 2800 16 1.8 567 318 16 4s2 3d1]
        - 22Ti[47.867 1.54 1668 3287 7.6 658.8 176 140 140 716 4507 4110 22 2.5 520 425 18.7 4s2 3d2]
        - 23V [50.9415 1.63 1910 3407 50.6 650.9 171 135 135 628 6110 5500 31 5.0 489 453 22.8 4s2 3d3]
        - 24Cr[51.9961 1.66 1907 2671 64.3 652.9 166 140 140 1120 7190 6300 94 7.9 448 339 20.5 4s1 3d5]
        - 25Mn[54.93804 1.55 1246 2061 0 717.3 161 140 140 196 7470 5950 7.8 0.62 479 220 13.2 4s2 3d5]
        - 26Fe[55.845 1.83 1538 2861 15.7 762.5 156 140 140 490 7874 6980 80 10 449 347 13.8 4s2 3d6]
        - 27Co[58.93319 1.88 1495 2900 63.7 760.4 152 135 135 700 8900 7750 100 17 421 375 16.2 4s2 3d7]
        - 28Ni[58.6934 1.91 1455 2913 112 737.1 149 135 135 700 8908 7810 91 14 445 378 17.2 4s2 3d8]
        - 29Co[63.546 1.90 1084.62 2562 118.4 745.5 145 135 135 874 8960 8020 400 59 384.4 300 13.1 4s1 3d10]
        - 30Zn[65.38 1.65 419.53 906.9 0 906.4 142 135 135 412 7140 6570 120 17 388 119 7.35 4s2 3d10]
        - 31Ga[69.723 1.81 29.760 2204 28.9 578.8 136 130 130 60 5904 6095 29 7.1 371 256 5.59 3d10 4p1]
        - 32Ge[72.63 2.01 938.25 2820 119 762 125 125 125 - 5323 5600 60 0.0020 321.4 334 31.8 3d10 4p2]
        - 33As[74.92160 2.18 816.9 614 78 947.0 114 115 115 1440 5727 5220 50 3.3 328 32.4 27.7 3d10 4p3]
        - 34Se[78.971 2.55 221 685 195 941.0 103 115 115 736 4819 3990 0.52 - 321.2 26 5.4 3d10 4p4]
        - 35Br[79.904 2.96 -7.350 58.9 324.6 1139.9 94 115 115 - 3120 3120 0.12 1.0e-16 947.3 14.8 5.8 3d10 4p5]
        - 36Kr[83.798 3.0 -157.36 -153.22 0 1350.8 88 - - - 3.75 - 0.00943 - 248.05 9.02 1.64 3d10 4p6]
        - 37Ru[85.4678 0.82 39.310 688 46.9 403.0 265 235 235 0.216 1532 1460 58 8.3 364 72 2.19 4p6 5s1]
        - 38Sr[87.62 0.95 776.9 1382 5.03 549.5 219 200 200 - 2630 2375 35 7.7 300 137 8 4p6 5s2]
        - 39Y [88.90584 1.22 1526 3345 29.6 600 212 180 180 589 4472 4240 17 1.8 298 380 11.4 5s2 4d1]
        - 40Zr[91.224 1.33 1855 4409 41.1 640.1 206 155 155 650 6511 5800 23 2.4 278 580 21 5s2 4d2]
        - 41Nb[92.90637 1.6 2477 4744 86.1 652.1 198 145 145 736 8570 - 54 6.7 265 690 26.8 5s1 4d4]
        - 42Mo[95.95 2.16 2623 4639 71.9 684.3 190 145 145 1500 10280 9330 139 20 251 600 36 5s1 4d5]
        - 43Tc[98 1.9 2157 4265 53 702 183 135 135 - 11500 - 51 5.0 63 550 23 5s2 4d5]
        - 44Ru[101.07 2.2 2334 4150 101.3 710.2 178 130 130 2160 12370 10650 120 14 238 580 25.7 5s1 4d7]
        - 45Rh[102.9055 2.28 1964 3695 109.7 719.7 173 135 135 1100 12450 10700 150 23 240 495 21.7 5s1 4d8]
        - 46Pd[106.42 2.20 1554.90 2963 53.7 804.4 169 140 140 37.3 12023 10380 72 10 240 380 16.7 4p6 4d10]
        - 47Ag[107.8682 1.93 961.780 2162 125.6 731.0 165 160 160 24.5 10490 9320 430 62 235 255 11.3 5s1 4d10]
        - 48Cd[112.414 1.69 321.07 766.9 0 867.8 161 155 155 203 8650 7996 97 14 230 100 6.3 5s2 4d10]
        - 49In[114.818 1.78 156.60 2072 28.9 558.3 156 155 155 8.83 7310 7020 82 12 233 230 3.26 4d10 5p1]
        - 50Sn[118.710 1.96 231.93 2602 107.3 708.6 145 145 145 51 7310 6990 67 9.1 217 290 7.0 4d10 5p2]
        - 51Sb[121.760 2.05 630.63 1587 103.2 834 133 145 145 294 6697 6530 24 2.5 207 68 19.7 4d10 5p3]
        - 52Te[127.60 2.1 449.51 987.9 190.2 869.3 123 140 140 180 6240 5700 3 0.010 201 48 17.5 4d10 5p4]
        - 53I [126.9045 2.66 113.70 184.3 295.2 1008.4 115 140 140 - 4940 - 0.449 1.0e-13 429.0 20.9 7.76 4d10 5p5]
        - 54Xe[131.293 2.6 -111.8 -108.0 0 1170.4 108 - - - 5.9 - 0.00565 - 158.32 12.64 2.30 4d10 5p6]
        - 55Cs[132.9055 0.79 28.440 671 45.5 375.7 298 260 260 0.14 1879 1843 36 5.0 242 65 2.09 5p6 6s1]
        - 56Ba[137.327 0.89 730 1870 13.95 502.9 253 215 215 - 3510 3338 18 2.9 205 140 8.0 5p6 6s2]
        - 57La[138.9055 1.10 919.9 3464 48 538.1 - 195 195 363 6146 5940 13 1.6 195 400 6.2 6s2 5d1]
        - 58Ce[140.116 1.12 797.9 3360 50 534.4 - 185 185 412 6689 6550 11 1.4 192 350 5.5 4f1 5d1]
        - 59Pr[140.9077 1.13 930.9 3290 50 527 247 185 185 481 6640 6500 13 1.4 193 330 6.9 6s2 4f3]
        - 60Nd[144.242 1.14 1021 3100 50 533.1 206 185 185 265 7010 6890 17 1.6 190 285 7.1 6s2 4f4]
        - 61Pm[145 - 1100 3000 50 540 205 185 185 - 7264 - 15 1.3 - 290 7.7 6s2 4f5]
        - 62Sm[150.36 1.17 1072 1803 50 544.5 238 185 185 441 7353 7160 13 1.1 196 175 8.6 6s2 4f6]
        - 63Eu[151.964 - 821.9 1500 50 547.1 231 185 185 - 5244 5130 14 1.1 182 175 9.2 6s2 4f7]
        - 64Gd[157.25 1.20 1313 3250 50 593.4 233 180 180 - 7901 7400 11 0.77 240 305 10 4f7 5d1]
        - 65Tb[158.9254 - 1356 3230 50 565.8 225 175 175 677 8219 7650 11 0.83 182 295 10.8 6s2 4f9]
        - 66Dy[162.500 1.22 1412 2567 50 573.0 228 175 175 500 8551 8370 11 1.1 167 280 11.1 6s2 4f10]
        - 67Ho[164.9303 1.23 1474 2700 50 581.0 226 175 175 746 8795 8340 16 1.1 165 265 17.0 6s2 4f11]
        - 68Er[167.259 1.24 1497 2868 50 589.3 226 175 175 814 9066 8860 15 1.2 168 285 19.9 6s2 4f12]
        - 69Tm[168.9342 1.25 1545 1950 50 596.7 222 175 175 471 9320 8560 17 1.4 160 250 16.8 6s2 4f13]
        - 70Yb[173.045 - 818.9 1196 50 603.4 222 175 175 343 6570 6210 39 3.6 154 160 7.7 6s2 4f14]
        - 71Lu[174.9668 1.27 1663 3402 50 523.5 217 175 175 893 9841 9300 16 1.8 154 415 22 4f14 5d1]
        - 72Hf[178.486 1.3 2233 4603 0 658.5 208 155 155 1700 13310 12000 23 3.3 144 630 25.5 4f14 5d2]
        - 73Ta[180.9479 1.5 3017 5458 31 761 200 145 145 800 16650 15000 57 7.7 140 735 36 4f14 5d3]
        - 74W [183.84 2.36 3422 5555 78.6 770 193 135 135 2570 19250 17600 170 20 132 800 35 4f14 5d4]
        - 75Re[186.207 1.9 3186 5596 14.5 760 188 135 135 1320 21020 18900 48 5.6 137 705 33 4f14 5d5]
        - 76Os[190.23 2.2 3033 5012 106.1 840 185 130 130 3920 22590 20000 88 12 130 630 31 4f14 5d6]
        - 77Ir[192.217 2.20 2466 4428 151 880 180 135 135 1670 22560 19000 150 21 131 560 26 4f14 5d7]
        - 78Pt[195.084 2.28 1768.3 3825 205.3 870 177 135 135 392 21450 19770 72 9.4 133 490 20 4f14 5d9]
        - 79Au[196.9666 2.54 1064.18 2856 222.8 890.1 174 135 135 25 19300 17310 320 45 129.1 330 12.5 4f14 5d10]
        - 80Hg[200.59 2.0 -38.830 356.73 0 1007.1 171 150 150 - 13534 13534 8.3 1.0 139.5 59.2 2.29 4f14 5d10]
        - 81Tl[204.38 1.62 304 1473 19.2 589.4 156 190 190 26.4 11850 11220 46 6.7 129 165 4.2 5d10 6p1]
        - 82Pb[207.2 2.33 327.46 1749 35.1 715.6 154 180 180 38.3 11340 10660 35 4.8 127 178 4.77 5d10 6p2]
        - 83Bi[208.9804 2.02 271.3 1564 91.2 703 143 160 160 94.2 9780 10050 8 0.77 122 160 10.9 5d10 6p3]
        - 84Po[209 2.0 255 961.9 183.3 812.1 135 190 190 - 9196 - - 2.3 - 100 13 5d10 6p4]
        - 85At[210 2.2 302 350 270.1 890 127 - - - - - 2 - - 40 6 5d10 6p5]
        - 86Rn[222 - -71.1 -61.85 0 1037 120 - - - 9.73 - 0.00361 - 93.65 17 3 5d10 6p6]
        - 87Fr[223 0.7 20.9 650 - 380 - - - - - - - - - 65 2 6p6 7s1]
        - 88Ra[226 0.9 700 1737 - 509.3 - 215 215 - 5000 - 19 1.0 92.0 125 8 6p6 7s2]
      - $T Metal oxides/Metalloxider:
        - Al2O3[-]
        - Fe2O3[-]
        - Fe3O4[-]
        - Ag2O[-]
      - $T Metal sulfides/Metallsulfider:
        - K2S[-]
        - MgS[-]
        - Al2S3[-]
      - $T Metal nitrids/Metallnitrider:
        - K3N[-]
        - Mg3N2[-]
        - AlN[-]
      - $T Strong acids/Starka syror:
        - _[MLt BLT DEN COL SML STR REA TOX]
        - HCl[- - - - U F - .]
        - H2SO4[- - - - . IH - .]
        - HNO3[- - - - U F L .]
      - $T Weak acids/Svaga syror:
        - _[MLt BLT DEN COL SML STR REA TOX]
        - H2CO3[- - - - - - - -]
        - H3PO4[- - - - - - - -]
      - $T Strong bases/Starka baser:
        - _[MLt BLT DEN COL SML STR REA TOX]
        - NaOH[- - - WHI - - - .]
        - KOH[- - - WHI - - - .]
        - Ca(OH)2[- - - - - - - .]
      - $T Weak bases/Svaga baser:
        - NH3[- - - - - - - .]
        - NaHCO3[- - - - - - - .]
      - $T Salts/Salter:
        - _[MLt BLT]
        - NaCl[- 800]
        - NaF[- -]
      - $T Salt precipitations/Fällningar:
        - Ca(OH)2[-]
        - Mg(OH)2[-]
        - Al(OH)3[-]
        - Mn(OH)2[-]
        - Zn(OH)2[-]
        - Fe(OH)2[-]
        - Fe(OH)3[-]
        - Cu(OH)2[-]
        - AgOH[-]
        - Pb(OH)2[-]
        - Ni(OH)2[-]
        - Co(OH)2[-]
        - AgCl[-]
        - Pb(Cl)2[-]
        - AgBr[-]
        - PbBr2[-]
        - BaSO4[GRE]
        - CaSO4[-]
        - PbSO4[-]
        - Ba2CO3[-]
        - CaCO3[-]
        - MgCO3[-]
        - Al2(CO3)3[-]
        - MnCO3[-]
        - FeCO3[-]
        - Fe2(CO3)3[-]
        - CuCO3[-]
        - Ag2CO3[-]
        - PbCO3[-]
        - NiCO3[-]
        - CoCO3[-]
        - FePO4[-]
        - AlPO4[-]
      - $T Reaction types/Reaktionstyper:
        - 1[H(A)+(B)OH->H2O+(BA)]
        - 2[(A)+(BC)->(B)+(AC)]
        - 3[(A)On+H(B)->H2O+(AB)]
        - 4[(AB)+(CD)->A++C-+BD]
      - $T Principle reactions/Principala reaktioner:
        - 1[N2+3H2<->2NH3]
        - 2[2NO2<->N2O4]
        - 3[H2+CO2<->H2O+CO]
        - 4[2HI<->H2+I2]
        - 5[CoCl4(2-)+6H2O<->Co(H2O)6(2+)+4(Cl-)]
        - 6[Co(H2O)6(2+)+HCl<->CoCl4(2-)+6H2O]
        - 7[Fe3+(YEL)+3SCN-<->Fe(SCN)3(ORA)]
        - 8[Ag++SCN-<->AgSCN-(s)(WHI)]
        - 9[2NaHCO3->Na2CO3+H2O+CO2]
        - 10[Fe(2+)+MnO4-+H+->Fe(3+)+Mn(2+)+H2O]
    - $S Organic chemistry/Organisk kemi:
      - $T Alkanes/Alkaner (-):
        - _[MLt BLt COL SML STR REA TOX]
        - 1[-183 -162 TRA . F - .]
        - 2[-183 -89 TRA . - - -]
        - 3[-188 -44 - - - - -]
        - 4[-138 0 - - - - -]
        - 5[-129 36 - - - - -]
        - 6[-95 69 - - - - -]
        - 7[-91 98 - - - - -]
        - 8[-57 126 - - - - -]
        - 9[-51 151 - - - - -]
        - 10[-30 174 - - - - -]
        - (1)3[-160 -12 - - - - -]
        - (2-1)4[-160 28 - - - - -]
        - (2,2-1)3[-16 10 - - - - -]
      - $T Cycloalkanes/Cykloalkaner (~n):
        - _[MLt BLt COL SML STR REA TOX]
        - ~3[-128 -33 TRA - - FU .]
        - ~4[-91 13 - - - U .]
        - ~5[-94 50 - - - - -]
        - ~6[6 81 - - - - -]
      - $T Alkenes/Alkener (=):
        - _[MLt BLt COL SML STR REA TOX]
        - 2=[-169.2 -103.7 - - - H .]
        - 3=[-185.2 -47.6 - - - - -]
        - 4=[-185.3 -6.3 - - - - -]
        - 5=[-165.2 36.1 - - - - -]
        - 6=[-140 62.8 - - - - -]
        - 7=[-119 93 - - - - -]
        - 8=[-101 122 - - - - -]
        - 9=[-57.5 101 - - - - -]
        - 10=[-45.5 163 - - - - -]
        - (2-1)3[-140.4 -6.9 - - - - -]
        - T4.2[106 0.3 - - - - -]
      - $T Alkynes/Alkyner (≡):
        - _[MLt BLt COL SML STR REA TOX]
        - 2≡[-84 -80.8 TRA Garlic E - .]
        - 3≡[-103 -23.2 - - - - -]
        - 4≡[-125.7 8.1 TRA Garlic - - -]
        - 5≡[-106 40 - - - - -]
        - 6≡[-131 70 - - - - -]
        - 7≡[-81 100 - - - - -]
        - 8≡[-42.6 128 - - - - -]
        - 9≡[-50 150 - - - - -]
        - 10≡[-44 174 - - - - -]
      - $T Arenes/Arener (~~n):
        - _[MLt BLt COL SML STR REA TOX]
        - ~~1[5.5 80.1 - - - R C]
        - (1)~~1[-95 110.6 TRA Petroleum - F B]
        - (1,2-1)~~1[-25 135 - - - - DNVUL]
        - (1,3-1)~~1[-48 140 - - - - -]
        - (1,4-1)~~1[13 145 - - - - -]
        - ~~2[80.3 218 WHI P C - -]
        - ~~3[217.5 340 TRA - - - .]
        - ~~5[179 495 - - - - .]
        - 2~~1[155 251 WHI Medical S - .]
        - 2*1[69 256 TRA - C - .]
      - $T Haloalkanes/alkyl halogenides/Haloalkaner (-X):
        - _[MLt BLt COL SML STR REA TOX]
        - Cl+1[-97.7 -24.2 TRA S - - DTORB]
        - Cl+2[-138.3 12.3 TRA - - - B(block_signal)]
        - Cl+3[-122.8 46.7 TRA - - - BI]
        - Cl+4[-123 77 TRA - - F .]
        - Cl+5[-99 107 TRA - - F -]
        - 2Cl+1[-97 40 - S - HA - N]
        - 3Cl+1[-63 62 TRA - - - EA]
        - 4Cl+1[-23 76 - S - H - EKB]
        - 2Cl+2[-35.7 83.5 TRA - O - -]
        - 3Cl+2[-35.5 113.6 TRA - LD+KD+CED]
        - 3Cl+2[-35.5 113.6 TRA - - - EKB]
        - (1Cl,1-2)4[- - - - - - -]
        - (1Cl-2*2-2)3[- - - - - - -]
        - F+1[- - - - - - -]
        - F+2[- - - - - - -]
        - F+3[- - - - - - -]
        - F+4[- - - - - - -]
        - F+5[- - - - - - -]
        - (F,3Cl)1[-110.5 23.7 TRA - - - -]
        - (2F,2Cl)1[-157.8 -29.8 TRA - - - -]
        - (3F,Cl)1[-181 -81.5 TRA S - - -]
        - (Br,2F,Cl)1[-159.5 -3.7 TRA - - - -]
        - (Br,3F)1[-108.9 7 TRA - - - -]
        - (2Br,2Cl,3F-1)2[-76 73 - - - - -]
      - $T Alcohols/Alkoholer (-OH):
        - _[MLt BLt COL SML STR REA TOX]
        - 1OH[-98 64.7 TRA F - - Blind]
        - 2OH[-114.3 78.4 TRA - - - B(Intoxication)]
        - 3OH[-126 97 TRA M - - -]
        - 4OH[-89 117 TRA - - - -]
        - 5OH[-77.6 138 TRA - - F -]
        - 6OH[-45 157 TRA Perfume/cut_grass - - .]
        - 7OH[-34.6 175.8 - Pleasant - - -]
        - 8OH[-14 200 TRA Citrus - - -]
        - 9OH[-6 214 BLA~YEL Citronella_oil/Orange - - I(Skin/Eyes)]
        - 10OH[6.4 233 TRA - V - -]
        - 2(12OH)[-13 198 TRA - - - KB]
        - 3(1~3OH)[18 290 TRA S I - _]
        - 6(1~6OH)[95 296 - S - - -]
        - ~~1+1[-16 204 - _ hygroskopisk - -]
      - $T Phenols/Fenoler (~~-(OH)):
        - _[MLt BLt COL SML STR REA TOX]
        - 1[40.5 181.7 - U - C .]
        - 1(12)[29.8 191 - - C F .]
        - 1(1~3)[11.8 203 - - I F .]
        - 1(1~4)[35.5 202 - - C F .]
        - 2[123 285 TRA B CN - ]
        - 3[121 363 - - - - -]
        - 2+2*4.3+2(Bisfenol A)[157 250 WHI~BRO - C - Endocrine_disruptor]
      - $T Aldehydes/Aldehyder:
        - _[MLt BLt COL SML STR REA TOX]
        - 1CHO[- - - - - - GI(Mucous)]
        - 2CHO[- - - - - - -]
        - 3CHO[- - - - - - -]
        - 4CHO[- - - - - - -]
        - 5CHO[- - - - - - -]
        - 6CHO[- - - - - - -]
        - 7CHO[- - - - - - -]
        - 8CHO[- - - - - - -]
        - 9CHO[- - - - - - -]
        - 10CHO[- - - - - - -]
      - $T Ketones/Ketoner:
        - _[MLt BLt COL SML STR REA TOX]
        - 3CO[- - - - V F -]
        - 2-4CO[- - - - - - -]
        - 3-4CO[- - - - - - -]
        - 2-5CO[- - - - - - -]
        - 3-5CO[- - - - - - -]
        - 4-5CO[- - - - - - -]
        - 2-6CO[- - - - - - -]
        - 3-6CO[- - - - - - -]
        - 4-6CO[- - - - - - -]
        - 5-6CO[- - - - - - -]
      - $T Carboxylic acids/Karboxylsyror (-COOH):
        - _[MLt BLt COL SML STR REA TOX]
        - 1COOH[- - - - - - -]
        - 2COOH[- - - - - - -]
        - 3COOH[- - - - - - -]
        - 4COOH[- - - - - - -]
        - 5COOH[- - - - - - -]
        - 6COOH[- - - - - - -]
        - 7COOH[- - - - - - -]
        - 8COOH[- - - - - - -]
        - 9COOH[- - - - - - -]
        - 10COOH[- - - - - - -]
        - 17COOH[- - - - - - -]
        - 18COOH[- - - - - - -]
        - Lactic[- - - - - - -]
        - Salicylic[- - - - - - -]
      - $T Esters/Estrar (-COO-):
        - _[MLt BLt COL SML STR REA TOX]
        - 2+2[- - - Peach - - -]
        - 4+1[- - - Raspberry - - -]
        - 4+4[- - - Pineapple - - -]
        - 5+2[- - - Banana - - -]
        - 5+5[- - - Apple - - -]
        - 8+2[- - - Orange - - -]
      - $T Ethers/Etrar (-O-):
        - _[MLt BLt COL SML STR REA TOX]
        - 1+1[-141 -24 TRA - - F -]
        - 1+2[-113 7.4 - - - F -]
        - 2+2[-141 35 - - W S -]
        - 1+3[-101 39 TRA - - F -]
        - 2+3[-127 63 TRA - - F I]
        - 3+3[-122 90 TRA S - F -]
        - 1+4[-116 70 - - - - -]
        - 2+4[-124 92.3 TRA - - F I(skin/eyes)]
        - 3+4[-62 120 - - - - -]
        - 4+4[-95 141 - - - - -]
      - $T Ether perioxides/Eter perioxider (-2O-):
        - _[MLt BLt COL SML STR REA TOX]
        - 2+2[- - - - - - -]
      - $T Amines/Aminer (-NH2):
        - _[MLt BLt COL SML STR REA TOX]
        - 1NH2[- - - - - - -]
        - 2NH2[- - - - - - -]
        - 3NH2[- - - - - - -]
        - 4NH2[- - - - - - -]
        - 5NH2[- - - - - - -]
        - 6NH2[- - - - - - -]
        - 7NH2[- - - - - - -]
        - 8NH2[- - - - - - -]
        - 9NH2[- - - - - - -]
        - 10NH2[- - - - - - -]
      - $T Thiols/Tioler (-SH):
        - _[MLt BLt COL SML STR REA TOX]
        - 1SH[-123 6 TRA - - F .]
        - 2SH[-148 35 TRA - - F .]
        - 3SH[-113 67 TRA~LYE - - W - I]
        - 4SH[-116 98 - - Clear C -]
        - 5SH[-76 127 TRA~YEL - - - I(skin/eyes)]
        - 6SH[-81 151 TRA Earth - - I(skin/eyes)]
        - 7SH[-43 177 TRA Onion - - I(skin/eyes)]
        - 8SH[-49 177 TRA Onion - - I(skin/eyes)]
        - 9SH[-20 220 - - - - -]
        - 10SH[-26 241 TRA - - - I]
      - $T Disulfides/Disulfider (-2S-):
        - _[MLt BLt COL SML STR REA TOX]
        - 1+1[-85 110 TRA Garlic - - -]
        - 1+2[- - - - - - -]
        - 2+2[- - - - - - -]
        - 1+3[- - - - - - -]
        - 2+3[- - - - - - -]
        - 3+3[- - - - - - -]
      - $T Nitro compounds/Nitroföreningar (-NO2):
        - _[MLt BLt COL SML STR REA TOX]
        - 1NO2[- - - - - - -]
        - 2NO2[- - - - - - -]
        - 3NO2[- - - - - - -]
        - 4NO2[- - - - - - -]
        - 5NO2[- - - - - - -]
        - 6NO2[- - - - - - -]
        - 7NO2[- - - - - - -]
        - 8NO2[- - - - - - -]
        - 9NO2[- - - - - - -]
        - 10NO2[- - - - - - -]
    - $S Reaction mechanism/Reaktionsmekanismer:
      - Organic reaction pathways:
        - L1[Alkanes -> Haloalkanes -> Alcohol (-> Ethers) (-> Ketones) -> Aldehyde -> Carboxylic acid -> Esters]
        - R1[Alkanes -> Alkylhalogenid -> Alkene]
      - $T Addition reaction:
        - A1[...]
        - A2*[...]
        - A3[...]
        - M1[...]
      - $T Substitution reaction:
        - Sn2[...]
        - Sn1[...]
      - $T Elimination reaction:
        - E2[...]
        - E2*[...]
        - E1[...]
        - E1*[...]
      - $T Oxidation and reduction:
        - OXI[...]
        - RED[...]
      - $T Condensation reaction:
        - CON[...]
        - HYD[...]
        - AHY[...]
        - BHY[...]
      - $T Polymerization:
        - PA[...]
        - PC[...]
    - $S Stochiometry:
      - $T Stochiometry basics:
        - eq(equation)[S(P_i) => S(R_j)]
        - m(mass)[S(m_i=M_i*n_i) = S(m_j=M_j*n_j)]
        - M(molmass)[M_i _ M_j]
        - n(amount of substance, <limiting>)[:(n_i) . :(n_j)]
        - n0[n0_i _ n0_j]
        - Δn[:(Δn_i) _ -:(Δn_j)]
        - n1[n0_i+Δn_i _ n0_j+Δn_j]
        - c[n_i/V _ n_j/V]
      - Other:
        - K = P(c_j)/P(c_i)
        - Ka = [H3O+][A-]/[HA]
        - Kb = [HB+][OH-]/[B]
        - Kw = Ka*Kb = [H3O+][OH-] = 1e-14
        - Ks = [A+][B-]
        - pKa = -lg Ka
        - pKb = -lg Kb
        - pKw = pKa+pKb = pH+pOH = -lg Kw = 14
        - pH = -lg[H3O+]
      - Titration:
        - ...
  - Biochemistry/Biokemi:
    - $S Cell Biology:
      - Cell types
      - Cells
    - $S Genetics
    - $S Biomolecules:
      - $T Carbohydrates [CAH]:
        - _[NAME S1 A1 DES]
        - (1)[Monosaccharide - - Solid+soluble+sweet]
        - 60[Glucose C6H12O6 Plants/Blood_sugar Reducing]
        - 50[Fructose C6H12O6 Plants Non-reducing]
        - 61[Galactose C6H12O6 Milk Reducing]
        - 51[Ribose C5H10O5 RNA -]
        - 52[Deoxyribose C5H10O4 DNA -]
        - (2)[Disaccharide - - Sweet]
        - S/60+50[Sucrose α12 Sugarcane&beets -]
        - L/60+61[Lactose α14 Milk Less_sweet]
        - M/2*60[Maltose α14 - -]
        - C/2*60[Cellubios β14 - -]
        - n*M[Starch(Amulose) α14 Plants(food/potatoes/flour/groat) Straight]
        - n*M[Starch(Amylopectine) α16 Plants(food) Branched]
        - n*60[Glucogen - liver+muscles -]
        - n*C[Cellulose - fiber+plants+paper/wood -]
        - n*6[Inulin - fiber+Jerusalem_artichokes -]
      - $T Lipids [LIP]:
        - nCOOH[Fatty-acids]
        - 3+nCOO[Triglyceride]
        - ...[Wax]
        - PO4+2*nCOOH[Phospholipid]
        - ...[Steroid]
        - ...[Caretenoid]
      - $T Amino acids [AMA]:
        - G/Gly[Glycine]
        - A/Ala[Alanine]
        - V/Val[Valine]
        - C/Cys[Cystein]
        - P/Pro[Proline]
        - L/Leu[Leucine]
        - I/Ile[Isoleucin]
        - M/Met[Metionin]
        - W/Trp[Tryptophane]
        - F/Phe[Phenylealanine]
        - S/Ser[Serine]
        - T/Thr[Treonine]
        - Y/Tyr[Tyrosine]
        - N/Asp[Asparagine]
        - Q/Gln[Glutamine]
        - D/Asp[Asparagine_acid]
        - E/Gly[Glutamine_acid]
        - K/Lys[Lysine]
        - R/Arg[Arginine]
        - H/His[Histidine]
      - Polypeptides [PPD]
      - $T Proteins [PRO]:
        - Keratine[...]
        - Actine[...]
        - Hemoglobine[...]
        - Collagen[...]
        - Structure[...]
        - Defense[...]
        - Signal[...]
        - Receptor[...]
        - Storage[...]
        - Transport[...]
        - Gene_regulating[...]
      - $T Enzymes [ENZ]:
        - Lactase[...]
        - Peptidase[...]
        - DNA-polymerase[...]
        - Glycogen_synthase[...]
        - Alcohol_dehydrogenase[...]
        - Phospholipase[...]
        - Lipase[...]
        - Helicase[...]
        - Catalase[...]
        - Decarboxylase[...]
        - Sackarase[...]
        - Cellulase[...]
      - $T Nucleic acids [NUC]:
        - A[Adenine (1ring)]
        - G[Guanine (1ring)]
        - C[Cytosine (2ring)]
        - T[Tymine (2ring)]
        - U[Uracile (2ring)]
        - AMP[Adeninmonophosphate ...]
        - ADP[Adenindiphosphate ...]
        - ATP[Adenintriphosphate ...]
        - n(N4)'[RNA (1string)+(AUCG)+Ribose]
        - n(N4)1[mRNA Messager]
        - n(N4)1[rRNA Ribosome]
        - n(N4)1[tRNA Transport]
        - n(N4)"[DNA (2string)+(ATCG)+Deoxyribose]
      - $T Vitamines [VIT]:
        - A[Good-for-eyes]
        - D[Help-hormone-production]
      - $T Cell substance:
        - _[Hormone_suppressants]
        - _[Pain-relieving_medicines]
        - _[Cytotoxin]
        - _[Toxines]
      - $T Medicines:
        - _[Ibuprofen]
        - _[Paracetamol]
        - _[Aspirin]
        - _[Vaccin]
        - _[Antibiotics (Penicillin) (Alexander Fleming (1928))]
    - $S Metabolism:
      - General metabolic pathways
      - Cellular respiration
      - Photosynthesis
    - $S Genetics:
      - Replication
      - Transcription
      - Translation
  - $S Biology/Biologi:
    - Plants and fungi
    - Physiology
- Languages/Språk:
  - $S Svenska ord:
    - $T INBOX:
      - Senare[Sedermera Sedan (där)Efter(åt)]
      - (be)Röra(ing)[]
      - Punkt[]
      - Lika[]
      - (fast)Binda/(sam)band[Likhet &Beröringspunkt]
      - (be)Skydd(a)[Hålla_någon_om_ryggen]
      - Mörk[Dunkel Oklar Obskyr(a) Skum]
      - Verka(n)[]
      - Flyta[]
      - Omvälv(ande)[Omstörta(ande) Radikal Revolutionerande]
      - Påverka(ande)[&Inflytande(else)(rik)]
      - Krok[]
      - Skev(het)[Sned &Krokig (för)Vränga(d)]
      - Antasta[Besvär(a/lig) Kritisera]
      - Röja(ning)(undan)[Rensa.Städa(ning)(upp)]
      - Belamrad[]
      - (Re)Citat(era)[]
      - Strid(a)[]
      - Neka[]
      - Avvisa[Dementera &Förneka &Bestrida]
      - Vista(else)[Sejour]
      - Gebit[Område]
      - Form[Figur ->Skepnad]
      - 1[->Transgression]
      - Stå(nd)[]
      - Sträva(ig)[]
      - Motstånd[&Motsträvig &Motspänstig]
      - Medborgare[Undersåte]
      - Självsäker[Karsk Kaxig]
      - Modig[Tapper Djärv]
      - Vilse(leda)[Förvillande/Villovägar]
      - Fyrkantighet[->]
    - $T Saker:
      - Holk[]
    - $T Röra(else):
      - Rörlig[Vig Smidig ->Spänstig]
      - Falla[]
      - (an/över)falla[Ta_på_sängen]
      - (om)Vända(else)[]
      - Välta[Välva]
      - Störta[]
    - $T Visa (upp):
      - (be)Visa[Certifikation Verifiera/Veritabel Attest]
      - Presentera[Representant]
    - $T Säga:
      - (ut)Tal(a/ande)[utsaga]
      - (upp)Mana(ing)[Vädja(n) Bud Order]
      - Konstatera[Framstå/hålla/häva påstå ...]
      - (ut)Sända(ande)[Emission]
      - Sänd(are/ebud)[Emissarie Representant]
  $S English words:
    - $T INBOX:
      - (In/Af)fluence
      - Push[->Nudge]
      - Instict(ive)[->Visceral]
`;
