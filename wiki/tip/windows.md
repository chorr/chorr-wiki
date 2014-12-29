# Windows Tip

## 키보드 타입 변경
Windows OS 에 해당되며 아래 레지스트리 조작으로 변경 가능하다.

    HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Services/i8042prt/Parameters

#### Korean 101 key Type A 
오른쪽 Alt, Ctrl 이 각각 한영, 한자 키로 인식

    LayerDriver KOR / REG_SZ / kbd101a.dll
    OverrideKeyboardIdentifier / REG_SZ / PCAT_101AKEY
    OverrideKeyboardSubtype / DWORD / 3
    OverrideKeyboardType / DWORD / 8

#### Korean 101 key Type B 
아직 모름

    LayerDriver KOR / REG_SZ / kbd101b.dll
    OverrideKeyboardIdentifier / REG_SZ / PCAT_101BKEY
    OverrideKeyboardSubtype / DWORD / 4
    OverrideKeyboardType / DWORD / 8

#### Korean 101 key Type C 
Shift-Space, Ctrl-Space 입력이 각각 한영, 한자 키 입력으로 인식

    LayerDriver KOR / REG_SZ / kbd101c.dll
    OverrideKeyboardIdentifier / REG_SZ / PCAT_101CKEY
    OverrideKeyboardSubtype / DWORD / 5
    OverrideKeyboardType / DWORD / 8

#### Korean 103/106 key 
오른쪽 Alt, Ctrl은 그대로에 한영, 한자 키가 별도로 있음

    LayerDriver KOR / REG_SZ / kbd103.dll
    OverrideKeyboardIdentifier / REG_SZ / PCAT_103KEY
    OverrideKeyboardSubtype / DWORD / 6
    OverrideKeyboardType / DWORD / 8

#### Realforce 86 한영키 전환 registry key
 
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\i8042prt\Parameters]
    "LayerDriver KOR"="kbd101a.dll"
    "OverrideKeyboardType"=dword:00000008
    "OverrideKeyboardSubtype"=dword:00000003
    "OverrideKeyboardIdentifier"="PCAT_101AKEY"

#### 참조 링크
[http://bspfp.pe.kr/37](http://bspfp.pe.kr/37)


## 폰트별 기본 한글폰트 변경
아래의 레지스트리 정보 수정

    Windows Registry Editor Version 5.00
    [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontLink\SystemLink]
    "MONACO"="나눔고딕코딩.ttf,나눔고딕코딩"
   