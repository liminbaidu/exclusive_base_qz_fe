<template>
    <v-row>
        <v-col cols="12" md="6" lg="3" class="personInfo" align="center">
            <div :style="xs||sm?{'margin-top': '10vh','font-size':'2.5rem'}:{'display':'none'}" class="personInfo-welcome">{{ configdata.welcometitle }}</div>  
            <v-avatar class="personInfo-avatar" :size="xs||sm?130:140" :style="xs||sm?{'margin-top': '5vh'}:{'margin-top': '2rem'}" @mouseenter="musicplayershow(1)" @mouseleave="musicplayershow(0)">
                <v-img :class="{'leleo-spin':isPlaying}"
                alt="Leleo"
                :src=configdata.avatar
                ></v-img>
                <transition name="fade">
                    <v-card v-show="ismusicplayer" class="musicplayer" :class="{'fade-in':ismusicplayer}" variant="tonal">
                        <div v-if="audioLoading" class="loading-spinner">
                            <v-progress-circular indeterminate></v-progress-circular>
                        </div>
                        <span ref="audiotitle" class="musicplayer-text"
                        style="top: 2rem;font-weight: bolder;"
                        >{{ musicinfo?.[0]?.title }}</span>
                        <span ref="audioauthor" class="musicplayer-text"
                        style="bottom: 1.4rem;"
                        >{{ musicinfo?.[0]?.author }}</span>
                        <audio v-show="false" ref="audioPlayer" :src="musicinfo?.[0]?.url" controls
                        @waiting="onWaiting"
                        @canplay="onCanPlay">
                        </audio>
                        <v-btn :size="xs||sm?22:30" color="#999999" icon @click="previousTrack()">
                        <v-icon>mdi-skip-previous</v-icon>
                        </v-btn>
                        <v-btn :size="xs||sm?35:48" color="#999999" icon @click="togglePlay()">
                        <v-icon>{{ isPlaying? 'mdi-pause' : 'mdi-play' }}</v-icon>
                        </v-btn>
                        <v-btn :size="xs||sm?22:30" color="#999999" icon @click="nextTrack()">
                        <v-icon>mdi-skip-next</v-icon>
                        </v-btn>
                    </v-card>
                </transition>
            </v-avatar>
            <typewriter :style="xs||sm?{'margin-top': '5vh','width':'90vw','font-size':'2rem'}:{'display':'none'}"></typewriter>
            <v-card class="ma-5 pa-2 leleo-left-card" variant="tonal" :max-width="xs?270:300" style="text-align: center;">
                <template v-slot:title>
                    <span>特性</span>
                </template>
                <v-chip v-for="item in personalizedtags" density="compact" link class="ma-1" size="small">
                {{item}}
                </v-chip>
             </v-card>

            <v-container class="leleo-left-socialIconsContainer">
                <v-card class="ma-5 pa-2 leleo-left-card" variant="tonal" :max-width="xs?270:300">
                    <span>社交</span>
                    <v-row align="center" justify="center" style="margin-top: 1vh;">
                        <v-col class="pa-1" cols="auto" v-for="item in socialPlatformIcons">
                            <v-btn :size="xs?25:33" variant="tonal" color="var(--leleo-vcard-color)"
                            class="ma-1 leleo-social-bticon"
                            icon
                            :href="item.link" target="_blank"
                            >
                        <v-icon :icon=item.icon :size="xs?20:25" class="social-bticon-icon"></v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        </v-col>  
    </v-row>
</template> 

<script>
    import config from '../config.js';
    import { useDisplay } from 'vuetify'
    import typewriter from '../components/personnalInfo/typewriter.vue';
    import polarchart from '../components/personnalInfo/polarchart.vue';
    import { getFormattedDate } from '../utils/common.js';
    

    export default {
        components: {
            typewriter,polarchart,getFormattedDate
        },
        setup() {
            const { xs,sm,md } = useDisplay();
            return { xs,sm,md };
        },
        data() {
            return {
                socialPlatformIcons: null,
                isloading:false,
                formattedDate:"",
                personalizedtags: null,
                configdata: config,
                videosrc: '',
                ismusicplayer: false,
                isPlaying:false,
                playlistIndex: 0,
                audioLoading: false,
                musicinfo: null,
                musicinfoLoading:false,
                projectcards:null,
            }
        },
        computed: {
            currentSong() {
                return this.musicinfo[this.playlistIndex];
            },
            audioPlayer() {
                return this.$refs.audioPlayer;
            }
        },
        async mounted() {
            this.socialPlatformIcons = this.configdata.socialPlatformIcons;
            this.$refs.audioPlayer.volume=this.configdata.musicPlayer.volume;
            this.formattedDate =  getFormattedDate(new Date());
            this.personalizedtags = this.configdata.tags;
            await this.getMusicInfo();  //获取音乐数据
            this.setupAudioListener();
        },
        methods: {
            musicplayershow(val) {
                this.ismusicplayer = val;
            },
            async getMusicInfo(){
                this.musicinfoLoading = true;
                try {
                    const response = await fetch(`https://api.i-meto.com/meting/api?server=${this.configdata.musicPlayer.server}&type=${this.configdata.musicPlayer.type}&id=${this.configdata.musicPlayer.id}`
                    );
                    if (!response.ok) {
                    throw new Error('网络请求失败');
                    }
                    this.musicinfo = await response.json();
                    this.musicinfoLoading = false;
                } catch (error) {
                    console.error('请求失败:', error);
                }
                    
            },
            setupAudioListener() {
                this.$refs.audioPlayer.addEventListener('ended', this.nextTrack);
            },
            togglePlay() {
                if (!this.isPlaying) {
                    this.audioPlayer.play();
                    this.isVdMuted = true;
                } else {
                    this.audioPlayer.pause();
                    this.isVdMuted = false;
                }
                this.isPlaying = !this.musicinfoLoading && !this.isPlaying;
            },
            previousTrack() {
                this.playlistIndex = this.playlistIndex > 0 ? this.playlistIndex - 1 : this.musicinfo.length - 1;
                this.updateAudio();
            },
            nextTrack() {
                this.playlistIndex = this.playlistIndex < this.musicinfo.length - 1 ? this.playlistIndex + 1 : 0;
                this.updateAudio();
            },
            updateAudio() {
                this.audioPlayer.src = this.currentSong.url;
                this.$refs.audiotitle.innerText = this.currentSong.title;
                this.$refs.audioauthor.innerText = this.currentSong.author;
                this.isPlaying = true;
                this.audioPlayer.play();
            },
            // 监听等待事件（缓冲不足）
            onWaiting() {
                this.audioLoading = true;
            },
            // 监听可以播放事件（缓冲足够）
            onCanPlay() {
                this.audioLoading = false;
            },
        }
    }
</script>
<style scoped>
  @import url(/css/app.less);
  @import url(/css/mobile.less);
</style>