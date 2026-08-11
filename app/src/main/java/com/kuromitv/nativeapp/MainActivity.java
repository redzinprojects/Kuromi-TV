package com.kuromitv.nativeapp;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String PLAYER_BASE = "https://sinaldvd.github.io/tv/player.html?id=";
    private static final String CHANNELS_URL = "https://raw.githubusercontent.com/redzinprojects/Kuromi-TV/main/channels.json";
    private static final String CACHE_KEY = "channels_json";
    private static final int BG = Color.rgb(12,12,15), RED = Color.rgb(185,25,42), WHITE = Color.WHITE, MUTED = Color.rgb(190,190,198);
    private final Map<String, ArrayList<Channel>> categories = new LinkedHashMap<>();
    private android.content.SharedPreferences prefs;
    private LinearLayout root, content;
    private WebView player;
    private TextView current, syncStatus;

    private static class Channel { final String name, id; Channel(String n, String i) { name=n; id=i; } }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state); requestWindowFeature(Window.FEATURE_NO_TITLE); getWindow().setStatusBarColor(BG); getWindow().setNavigationBarColor(BG);
        prefs = getSharedPreferences("kuromi", MODE_PRIVATE); seedFallback(); showHomeOrLogin();
    }

    private void seedFallback() {
        categories.clear();
        add("Canais Abertos", new String[][]{{"Globo RJ","globorj"},{"Globo SP","globosp"},{"Globo MG","globomg"},{"Globo PE","globope"},{"SBT","sbt"},{"SBT SP","sbtsp"},{"Record TV","record"},{"Band","band"}});
        add("Notícias", new String[][]{{"GloboNews","globonews"},{"SBT NEWS","sbtnews"},{"BandNews","bandnews"},{"CNN Brasil","cnnbrasil"},{"Jovem Pan News","jovempan"}});
        add("Esportes", new String[][]{{"SporTV","sportv"},{"SporTV 2","sportv2"},{"SporTV 3","sportv3"},{"ESPN","espn"},{"ESPN 2","espn2"},{"Premiere","premiere"},{"Combate","combate"},{"Cazé TV","cazetv"}});
        add("Filmes e Séries", new String[][]{{"Telecine","telecine"},{"Telecine Premium","telecinepremium"},{"Universal TV","universal"},{"Studio Universal","studiouniversal"},{"Megapix","megapix"},{"AMC","amc"},{"Paramount Network","paramount"},{"AXN","axn"}});
        add("Infantil", new String[][]{{"Gloob","gloob"},{"Gloobinho","gloobinho"},{"Nickelodeon","nickelodeon"},{"Nick Jr.","nickjr"},{"Cartoon Network","cartoonnetwork"},{"Discovery Kids","discoverykids"}});
        add("Documentários e Cultura", new String[][]{{"Canal Brasil","canalbrasil"},{"Arte 1","arte1"},{"Discovery Channel","discovery"},{"History Channel","history"},{"Animal Planet","animalplanet"},{"National Geographic","natgeo"}});
    }
    private void add(String category, String[][] values) { ArrayList<Channel> list=new ArrayList<>(); for(String[] c:values) list.add(new Channel(c[0],c[1])); categories.put(category,list); }
    private TextView text(String value, int size, int color) { TextView v=new TextView(this); v.setText(value); v.setTextSize(size); v.setTextColor(color); v.setPadding(20,12,20,12); return v; }
    private LinearLayout base() { LinearLayout l=new LinearLayout(this); l.setOrientation(LinearLayout.VERTICAL); l.setPadding(28,20,28,20); l.setBackgroundColor(BG); return l; }
    private Button button(String label) { Button b=new Button(this); b.setText(label); b.setTextColor(WHITE); b.setTextSize(15); b.setAllCaps(false); b.setFocusable(true); b.setBackgroundColor(RED); b.setPadding(18,4,18,4); return b; }
    private EditText field(String hint, boolean pass) { EditText e=new EditText(this); e.setHint(hint); e.setHintTextColor(MUTED); e.setTextColor(WHITE); e.setTextSize(16); if(pass) e.setInputType(0x81); e.setSingleLine(); e.setPadding(16,4,16,4); return e; }
    private void showHomeOrLogin() { if(prefs.getString("user",null)==null) showLogin(); else showCatalog(); }
    private void showLogin() {
        root=base(); root.setGravity(Gravity.CENTER); TextView title=text("KUROMI TV",34,WHITE); title.setGravity(Gravity.CENTER); root.addView(title,new LinearLayout.LayoutParams(-1,70));
        final EditText user=field("Usuário",false), pass=field("Senha",true); root.addView(user,new LinearLayout.LayoutParams(420,58)); root.addView(pass,new LinearLayout.LayoutParams(420,58));
        Button login=button("Entrar"); login.setOnClickListener(v->{if(user.getText().length()>0&&pass.getText().length()>0){prefs.edit().putString("user",user.getText().toString()).apply();showCatalog();}else toast("Informe usuário e senha");}); root.addView(login,new LinearLayout.LayoutParams(420,58));
        Button register=button("Criar conta"); register.setOnClickListener(v->{if(user.getText().length()>0){prefs.edit().putString("user",user.getText().toString()).apply();showCatalog();}else toast("Informe um usuário");}); root.addView(register,new LinearLayout.LayoutParams(420,58)); setContentView(root); login.requestFocus();
    }
    private void showCatalog() {
        root=base(); ScrollView scroll=new ScrollView(this); content=new LinearLayout(this); content.setOrientation(LinearLayout.VERTICAL);
        LinearLayout header=new LinearLayout(this); header.setGravity(Gravity.CENTER_VERTICAL); TextView title=text("KUROMI TV",28,WHITE); header.addView(title,new LinearLayout.LayoutParams(0,70,1));
        syncStatus=text("Sincronizando catálogo…",13,MUTED); header.addView(syncStatus,new LinearLayout.LayoutParams(190,58)); Button refresh=button("Atualizar"); refresh.setOnClickListener(v->syncChannels()); header.addView(refresh,new LinearLayout.LayoutParams(130,58)); Button logout=button("Sair"); logout.setOnClickListener(v->{prefs.edit().clear().apply();showLogin();}); header.addView(logout,new LinearLayout.LayoutParams(90,58)); content.addView(header);
        player=new WebView(this); player.setBackgroundColor(Color.BLACK); WebSettings ws=player.getSettings(); ws.setJavaScriptEnabled(true); ws.setDomStorageEnabled(true); ws.setMediaPlaybackRequiresUserGesture(false); ws.setLoadWithOverviewMode(true); ws.setUseWideViewPort(true); player.setWebViewClient(new WebViewClient()); player.setWebChromeClient(new WebChromeClient()); content.addView(player,new LinearLayout.LayoutParams(-1,360)); current=text("Escolha um canal abaixo",18,MUTED); current.setGravity(Gravity.CENTER); content.addView(current,new LinearLayout.LayoutParams(-1,58));
        scroll.addView(content); root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1)); setContentView(root); renderCategories(); syncChannels();
    }
    private void renderCategories() {
        if(content==null) return; while(content.getChildCount()>3) content.removeViewAt(3);
        for(Map.Entry<String,ArrayList<Channel>> entry:categories.entrySet()) { TextView cat=text(entry.getKey(),22,WHITE); cat.setPadding(8,24,8,8); content.addView(cat); HorizontalScrollView hs=new HorizontalScrollView(this); LinearLayout row=new LinearLayout(this); row.setOrientation(LinearLayout.HORIZONTAL); for(Channel c:entry.getValue()){Button b=button(c.name); b.setTag(c); b.setOnClickListener(v->{Channel ch=(Channel)v.getTag();play(ch.id,ch.name);}); row.addView(b,new LinearLayout.LayoutParams(170,60));} hs.addView(row); content.addView(hs,new LinearLayout.LayoutParams(-1,78)); }
    }
    private void syncChannels() {
        String cached=prefs.getString(CACHE_KEY,null); if(cached!=null) try{parseChannels(cached);renderCategories();}catch(Exception ignored){}
        new Thread(()->{try{HttpURLConnection connection=(HttpURLConnection)new URL(CHANNELS_URL).openConnection(); connection.setConnectTimeout(10000); connection.setReadTimeout(15000); connection.setRequestProperty("Cache-Control","no-cache"); connection.connect(); if(connection.getResponseCode()!=200) throw new Exception("HTTP "+connection.getResponseCode()); InputStream in=connection.getInputStream(); BufferedReader br=new BufferedReader(new InputStreamReader(in,"UTF-8")); StringBuilder body=new StringBuilder(); String line; while((line=br.readLine())!=null) body.append(line); br.close(); String json=body.toString(); parseChannels(json); prefs.edit().putString(CACHE_KEY,json).apply(); runOnUiThread(()->{renderCategories(); if(syncStatus!=null) syncStatus.setText("Catálogo atualizado");}); connection.disconnect();}catch(Exception e){runOnUiThread(()->{if(syncStatus!=null) syncStatus.setText("Catálogo em cache/offline");});}}).start();
    }
    private void parseChannels(String json) throws Exception { JSONObject rootJson=new JSONObject(json); JSONArray cats=rootJson.getJSONArray("categories"); LinkedHashMap<String,ArrayList<Channel>> next=new LinkedHashMap<>(); for(int i=0;i<cats.length();i++){JSONObject cat=cats.getJSONObject(i); String name=cat.getString("name"); JSONArray channels=cat.getJSONArray("channels"); ArrayList<Channel> list=new ArrayList<>(); for(int j=0;j<channels.length();j++){JSONObject c=channels.getJSONObject(j); list.add(new Channel(c.getString("name"),c.getString("id")));} next.put(name,list);} categories.clear(); categories.putAll(next); }
    private void play(String id,String name){current.setText("Canal atual: "+name);player.loadUrl(PLAYER_BASE+android.net.Uri.encode(id));}
    private void toast(String s){Toast.makeText(this,s,Toast.LENGTH_SHORT).show();}
    @Override protected void onDestroy(){if(player!=null)player.destroy();super.onDestroy();}
}
