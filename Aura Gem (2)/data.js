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
        - _[MAS(u) RAD(e-10m) 1IZ(kJ/mol) ELE]
        - 1H[1.008 .25 1312 2.20]
        - 2He[4.003 .31 2372 -]
        - 3Li[6.941 1.45 520.2 .98]
        - 4Be[9.012 1.05 899.5 1.57]
        - 5B[10.811 .85 800.6 2.04]
        - 6C[12.011 .7 1087 2.55]
        - 7N[14.007 .65 1402 3.04]
        - 8O[15.999 .6 1314 3.44]
        - 9F[18.998 .5 1681 3.98]
        - 10Ne[20.180 .38 2081 -]
        - 11Na[22.990 1.8 495.8 .93]
        - 12Mg[24.305 1.5 737.7 1.31]
        - 13Al[26.982 1.25 577.5 1.61]
        - 14Si[28.086 1.1 786.5 1.90]
        - 15P[30.974 1 1012 2.19]
        - 16S[32.065 1 999.6 2.58]
        - 17Cl[35.453 1 1251 3.16]
        - 18Ar[39.948 7.1 1521 -]
        - 19K[39.098 2.2 418.8 0.82]
        - 20Ca[40.078 1.8 589.8 1.00]
        - 21Sc[44.956 1.6 633.1 1.36]
        - 22Ti[47.867 1.4 658.8 1.54]
        - 23V[50.942 1.35 650.9 1.63]
        - 24Cr[51.996 1.4 652.9 1.66]
        - 25Mn[54.938 1.4 717.3 1.55]
        - 26Fe[- - - -]
        - 27Co[- - - -]
        - 28Ni[- - - -]
        - 29Co[- - - -]
        - 30Zn[- - - -]
        - 31Ga[- - - -]
        - 32Ge[- - - -]
        - 33As[- - - -]
        - 34Se[- - - -]
        - 35Br[- - - -]
        - 36Kr[- - - -]
        - 37Ru[- - - -]
        - 38Sr[- - - -]
        - 39Y[- - - -]
        - 40Zr[- - - -]
        - 41Nb[- - - -]
        - 42Mo[- - - -]
        - 43Tc[- - - -]
        - 44Ru[- - - -]
        - 45Rh[- - - -]
        - 46Pd[- - - -]
        - 47Ag[- - - -]
        - 48Cd[- - - -]
        - 49In[- - - -]
        - 50Sn[- - - -]
        - 51Sb[- - - -]
        - 52Te[- - - -]
        - 53I[- - - -]
        - 54Xe[- - - -]
        - 55Cs[- - - -]
        - 56Ba[- - - -]
        - 57La[- - - -]
        - 58Ce[- - - -]
        - 59Pr[- - - -]
        - 60Nd[- - - -]
        - 61Pm[- - - -]
        - 62Sm[- - - -]
        - 63Eu[- - - -]
        - 64Gd[- - - -]
        - 65Tb[- - - -]
        - 66Dy[- - - -]
        - 67Ho[- - - -]
        - 68Er[- - - -]
        - 69Tm[- - - -]
        - 70Yb[- - - -]
        - 71Lu[- - - -]
        - 72Hf[- - - -]
        - 73Ta[- - - -]
        - 74W[- - - -]
        - 75Re[- - - -]
        - 76Os[- - - -]
        - 77Ir[- - - -]
        - 78Pt[- - - -]
        - 79Au[- - - -]
        - 80Hg[- - - -]
        - 81Tl[- - - -]
        - 82Pb[- - - -]
        - 83Bi[- - - -]
        - 84Po[- - - -]
        - 85At[- - - -]
        - 86Rn[- - - -]
        - 87Fr[- - - -]
        - 88Ra[- - - -]
      - $T Molecules/Molekyler:
        - _[MLt BLT DEN COL SML TOX]
        - H2[-259.1 -252.9 90 TRA - -]
        - B[2076 3927 2460 BLA~GRA - -]
        - C[3527 4027 2260 BLA - -]
        - N2[-210 -195.8 1250 - - -]
        - O2[-218 -183 1430 TRA - -]
        - O3[- - - TRA U I(Lungs)]
        - F2[-219.7 -188.1 1700 WHI - -]
        - P5[44.15 277 1820 - - .]
        - S8[95.3 444.6 1960 YEL - -]
        - Cl2[-101.5 -34.04 3210 GRE~YEL - .]
        - Se[221 685 - - - -]
        - Br2[-7.3 58.8 - ORA~BRO - .]
        - I2[113.7 184.3 - - .]
        - CO[- - - TRA . .(Suffocating)]
        - CO2[- - - TRA . -]
        - H2O[- - - TRA . -]
        - SO2[- - - TRA - .(Acid rain)]
        - NO[- - - TRA - .(Acid rain)]
      - $T Metals/Metaller:
        - _[MLt BLT DEN COL TOX]
        - Li[180.5 1347 540 GRA -]
        - Be[1287 2970 1850 - -]
        - Na[97.79 882.9 970 - -]
        - Mg[650 1090 1740 GRA -]
        - Al[660.3 2470 2700 SIL -]
        - Si[1414 3265 2330 - -]
        - K[63.5 759 860 - -]
        - Ca[842 1484 1550 - -]
        - Sc[1541 2836 2990 - -]
        - Ti[1668 3287 4510 - -]
        - V[1910 3407 6110 - -]
        - Cr[1907 2482 7140 - -]
        - Mn[1246 2061 7470 - -]
        - Fe[1538 2861 - WHI -]
        - Co[1495 2927 - - -]
        - Ni[1455 2730 - - -]
        - Cu[1058 2562 - RED~BRO -]
        - Zn[419.5 907 - GRA -]
        - Ga[29.76 2400 - - -]
        - Ge[938.3 2833 - - -]
        - As[817 614 - - -]
        - Rb[39.3 688 - - -]
        - Sr[777 1382 - - -]
        - Y[1526 2930 - - -]
        - Zr[1855 4377 - - -]
        - Nb[2477 4744 - - -]
        - Mo[2623 4639 - - -]
        - Tc[2157 4265 - - -]
        - Ru[2334 4150 - - -]
        - Rh[1964 3695 - - -]
        - Pd[1555 2963 - - -]
        - Ag[961.8 2210 - - -]
        - Cd[321.1 767 - - -]
        - In[156.6 2072 - - -]
        - Sn[231.9 2602 - GRA -]
        - Sb[630.6 1635 - - -]
        - Te[449.5 988 - - -]
        - Cs[28.5 671 - - -]
        - Ba[727 1640 - - -]
        - La[920 3464 - - -]
        - Ce[795 3443 - - -]
        - Pr[935 3130 - - -]
        - Nd[1024 3074 - - -]
        - Pm[1042 3000 - - -]
        - Sm[1072 1900 - - -]
        - Eu[826 1529 - - -]
        - Gd[1312 3000 - - -]
        - Tb[1356 3123 - - -]
        - Dy[1407 2567 - - -]
        - Ho[1461 2600 - - -]
        - Er[1529 2868 - - -]
        - Tm[1545 1730 - - -]
        - Yb[824 1196 - - -]
        - Lu[1652 3402 - - -]
        - Hf[2233 4603 - - -]
        - Ta[3017 5458 - - -]
        - W[3422 5930 - - -]
        - Re[3186 5596 - - -]
        - Os[3033 5012 - - -]
        - Ir[2446 4130 - - -]
        - Pt[1768 3825 - - -]
        - Au[1064 2970 - - -]
        - Hg[-38.83 356.7 - WHI~SIL -]
        - Tl[304 1473 - - -]
        - Pb[327.5 1749 - GRA -]
        - Bi[271.5 1564 - - -]
        - Po[254 962 - - -]
        - At[302 337 - - -]
        - Fr[27 677 - - -]
        - Ra[696 1737 - - -]
      - $T Noble gases/Ädelgaser:
        - _[MLt BLT DEN COL TOX]
        - He[-272.2 -268.9 180 TRA -]
        - Ne[-248.6 -246 900 TRA -]
        - Ar[-189.3 -185.8 1780 TRA -]
        - Kr[-157.4 -153.4 - TRA -]
        - Xe[-111.8 -108.1 - TRA -]
        - Rn[-71 -61.7 - TRA C(Lungs)Radioactive]
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