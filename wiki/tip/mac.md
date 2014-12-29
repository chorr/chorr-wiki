# Mac OS X Tip

## 추천 어플리케이션
- [Display Menu](https://itunes.apple.com/kr/app/display-menu/id549083868?mt=12) - 해상도 조절
- [Mou](http://mouapp.com/) - 마크다운 에디터
- [GPSPhotoLinker](http://www.earlyinnovations.com/gpsphotolinker/) - 사진에 위치정보 싱크
- [svnX](http://code.google.com/p/svnx/) - SVN GUI tool
- [iStat Menus](http://bjango.com/mac/istatmenus/)
- [Cyberduck](https://cyberduck.io/) - FTP 클라이언트
- [Secrets](http://secrets.blacktree.com) - A database of hidden settings for Mac OS X
- [무비스트](http://cocoable.tistory.com) - 동영상 플레이어
- [AppCleaner](http://www.freemacsoft.net/appcleaner/)
- [HandBrake](https://handbrake.fr/) - 동영상 변환기

## 터미널 색상 적용
    export TERM="xterm-color"
    export CLICOLOR=1
    export LSCOLORS=ExFxCxDxBxegedabagacad
    
## 크롬 언어 변경
    defaults write com.google.Chrome AppleLanguages '(en)'
    
## 메뉴바 아이콘 재설정
    rm ~/Library/Preferences/com.apple.systemuiserver.plist
    killall SystemUIServer
    
## Launchpad 초기화
    ~/Library/Application\ Support/Dock/*.db
    sqlite3 ~/Library/Application\ Support/Dock/*.db 'DELETE FROM apps;'
    killall Dock

## iOS 기기 완전 초기화 DFU
1. 아이튠즈가 설치 된 컴퓨터에 기기를 연결 합니다.
2. 기기의 전원을 끕니다.
3. 홈버튼 + 전원버튼 동시에 누릅니다. (이때 애플 로고가 뜸)
4. 약 10초 후 (로고가 없어질때쯤) 전원버튼에서 손을 땝니다.
5. 5초 후 홈버튼에서 손을 땝니다.
6. 아이튠즈에 경고창이 뜰 것이고 복원 버튼을 누르면 초기화가 진행 됩니다.

