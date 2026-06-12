const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const imagesDir = path.join(projectDir, "assets", "images");

const renameMap = {
  "sorochki.png": "sorochki.png",
  "bryuki.png": "bryuki.png",
  "galstuki.png": "galstuki.png",
  "kashne.png": "kashne.png",
  "portmane.png": "portmane.png",
  "klatchi.png": "klatchi.png",
  "sumki.png": "sumki.png",
  "remni.png": "remni.png",
  "klyuchnitsy.png": "klyuchnitsy.png",
  "kartholdery.png": "kartholdery.png",
  "muzhskie_sorochki_gavioli.png": "muzhskie_sorochki_gavioli.png",
  "muzhskaya_sorochka_gavioli.png": "muzhskaya_sorochka_gavioli.png",
  "muzhskaya_sorochka_gavioli_2.png": "muzhskaya_sorochka_gavioli_2.png",
  "muzhskaya_sorochka_gavioli_3.png": "muzhskaya_sorochka_gavioli_3.png",
  "muzhskaya_sorochka_gavioli_4.png": "muzhskaya_sorochka_gavioli_4.png",
  "muzhskaya_sorochka_gavioli_5.png": "muzhskaya_sorochka_gavioli_5.png",
  "muzhskaya_sorochka_gavioli_6.png": "muzhskaya_sorochka_gavioli_6.png",
  "muzhskaya_sorochka_gavioli_7.png": "muzhskaya_sorochka_gavioli_7.png",
  "muzhskaya_sorochka_gavioli_8.png": "muzhskaya_sorochka_gavioli_8.png",
  "muzhskaya_sorochka_gavioli_9.png": "muzhskaya_sorochka_gavioli_9.png",
  "muzhskaya_sorochka_gavioli_10.png": "muzhskaya_sorochka_gavioli_10.png",
  "muzhskaya_sorochka_gavioli_11.png": "muzhskaya_sorochka_gavioli_11.png",
  "muzhskaya_sorochka_gavioli_12.png": "muzhskaya_sorochka_gavioli_12.png",
  "muzhskaya_sorochka_gavioli_13.png": "muzhskaya_sorochka_gavioli_13.png",
  "muzhskaya_sorochka_gavioli_14.png": "muzhskaya_sorochka_gavioli_14.png",
  "bryuki_slaksy_gavioli.png": "bryuki_slaksy_gavioli.png",
  "bryuki_slaksy_gavioli_2.png": "bryuki_slaksy_gavioli_2.png",
  "bryuki_slaksy_gavioli_3.png": "bryuki_slaksy_gavioli_3.png",
  "bryuki_slaksy_gavioli_4.png": "bryuki_slaksy_gavioli_4.png",
  "kashne_cacharel.png": "kashne_cacharel.png",
  "kashne_cacharel_2.png": "kashne_cacharel_2.png",
  "kashne_cacharel_3.png": "kashne_cacharel_3.png",
  "muzhskoy_galstuk.png": "muzhskoy_galstuk.png",
  "muzhskoy_galstuk_2.png": "muzhskoy_galstuk_2.png",
  "muzhskoy_galstuk_3.png": "muzhskoy_galstuk_3.png",
  "muzhskoy_galstuk_4.png": "muzhskoy_galstuk_4.png",
  "muzhskoy_galstuk_5.png": "muzhskoy_galstuk_5.png",
  "muzhskoy_galstuk_6.png": "muzhskoy_galstuk_6.png",
  "muzhskoy_galstuk_7.png": "muzhskoy_galstuk_7.png",
  "muzhskoy_galstuk_8.png": "muzhskoy_galstuk_8.png",
  "muzhskoy_galstuk_9.png": "muzhskoy_galstuk_9.png",
  "muzhskoy_galstuk_10.png": "muzhskoy_galstuk_10.png",
  "muzhskoy_galstuk_11.png": "muzhskoy_galstuk_11.png",
  "muzhskoy_galstuk_12.png": "muzhskoy_galstuk_12.png",
  "muzhskoy_galstuk_13.png": "muzhskoy_galstuk_13.png",
  "muzhskoy_galstuk_14.png": "muzhskoy_galstuk_14.png",
  "vertikal_noe_muzhskoe_portmane_karya.png": "vertikal_noe_muzhskoe_portmane_karya.png",
  "vertikal_noe_muzhskoe_portmane_bond.png": "vertikal_noe_muzhskoe_portmane_bond.png",
  "vertikal_noe_muzhskoe_portmane_tony_bellucci_t.png": "vertikal_noe_muzhskoe_portmane_tony_bellucci_t.png",
  "vertikal_noe_muzhskoe_portmane_karya_2.png": "vertikal_noe_muzhskoe_portmane_karya_2.png",
  "vertikal_noe_muzhskoe_portmane.png": "vertikal_noe_muzhskoe_portmane.png",
  "muzhskoe_portmane_karya.png": "muzhskoe_portmane_karya.png",
  "klatch_muzhskoy_bond.png": "klatch_muzhskoy_bond.png",
  "klatch_muzhskoy_bond_2.png": "klatch_muzhskoy_bond_2.png",
  "klatch_muzhskoy_bond_3.png": "klatch_muzhskoy_bond_3.png",
  "klatch_muzhskoy_bond_4.png": "klatch_muzhskoy_bond_4.png",
  "kozhanyy_klatch_s_ruchkoy_karya.png": "kozhanyy_klatch_s_ruchkoy_karya.png",
  "zhenskiy_klatch_karya.png": "zhenskiy_klatch_karya.png",
  "zhenskiy_klatch_karya_2.png": "zhenskiy_klatch_karya_2.png",
  "zhenskiy_klatch_karya_3.png": "zhenskiy_klatch_karya_3.png",
  "zhenskiy_klatch_karya_4.png": "zhenskiy_klatch_karya_4.png",
  "zhenskiy_klatch_karya_5.png": "zhenskiy_klatch_karya_5.png",
  "zhenskiy_klatch_karya_6.png": "zhenskiy_klatch_karya_6.png",
  "zhenskiy_klatch_karya_7.png": "zhenskiy_klatch_karya_7.png",
  "zhenskiy_klatch_karya_8.png": "zhenskiy_klatch_karya_8.png",
  "zhenskiy_klatch_karya_9.png": "zhenskiy_klatch_karya_9.png",
  "zhenskiy_klatch_karya_10.png": "zhenskiy_klatch_karya_10.png",
  "zhenskiy_klatch_karya_11.png": "zhenskiy_klatch_karya_11.png",
  "zhenskiy_klatch_karya_12.png": "zhenskiy_klatch_karya_12.png",
  "zhenskiy_klatch_karya_13.png": "zhenskiy_klatch_karya_13.png",
  "muzhskaya_kozhanaya_sumka_karya.png": "muzhskaya_kozhanaya_sumka_karya.png",
  "sumka_bananka_bond.png": "sumka_bananka_bond.png",
  "sumka_pod_planshet_tony_bellucci.png": "sumka_pod_planshet_tony_bellucci.png",
  "muzhskaya_kozhanaya_sumka_bond.png": "muzhskaya_kozhanaya_sumka_bond.png",
  "muzhskaya_sumka_bond.png": "muzhskaya_sumka_bond.png",
  "muzhskaya_sumka_bond_2.png": "muzhskaya_sumka_bond_2.png",
  "muzhskaya_sumka_bond_3.png": "muzhskaya_sumka_bond_3.png",
  "muzhskaya_sumka_bond_4.png": "muzhskaya_sumka_bond_4.png",
  "muzhskaya_sumka_bond_5.png": "muzhskaya_sumka_bond_5.png",
  "muzhskaya_kozhanaya_sumka_karya_2.png": "muzhskaya_kozhanaya_sumka_karya_2.png",
  "muzhskaya_kozhanaya_sumka_karya_3.png": "muzhskaya_kozhanaya_sumka_karya_3.png",
  "kozhanaya_dorozhnaya_sumka_karya.png": "kozhanaya_dorozhnaya_sumka_karya.png",
  "muzhskaya_sumka_bond_6.png": "muzhskaya_sumka_bond_6.png",
  "kozhanyy_remen_karya.png": "kozhanyy_remen_karya.png",
  "kozhanyy_remen_karya_2.png": "kozhanyy_remen_karya_2.png",
  "kozhanyy_remen_karya_3.png": "kozhanyy_remen_karya_3.png",
  "kozhanyy_remen_karya_4.png": "kozhanyy_remen_karya_4.png",
  "kozhanyy_remen_karya_5.png": "kozhanyy_remen_karya_5.png",
  "kozhanyy_remen_karya_6.png": "kozhanyy_remen_karya_6.png",
  "kozhanyy_remen_karya_7.png": "kozhanyy_remen_karya_7.png",
  "kozhanyy_remen_karya_8.png": "kozhanyy_remen_karya_8.png",
  "kozhanyy_remen_karya_9.png": "kozhanyy_remen_karya_9.png",
  "kozhanyy_remen_karya_10.png": "kozhanyy_remen_karya_10.png",
  "kozhanyy_remen_karya_11.png": "kozhanyy_remen_karya_11.png",
  "kozhanyy_remen_karya_12.png": "kozhanyy_remen_karya_12.png",
  "kozhanyy_remen_karya_13.png": "kozhanyy_remen_karya_13.png",
  "kozhanyy_remen_karya_14.png": "kozhanyy_remen_karya_14.png",
  "kozhanyy_remen_karya_15.png": "kozhanyy_remen_karya_15.png",
  "kozhanyy_remen_karya_16.png": "kozhanyy_remen_karya_16.png",
  "klyuchnitsa_karya.png": "klyuchnitsa_karya.png",
  "klyuchnitsa_karya_2.png": "klyuchnitsa_karya_2.png",
  "klyuchnitsa_karya_3.png": "klyuchnitsa_karya_3.png",
  "klyuchnitsa_karya_4.png": "klyuchnitsa_karya_4.png",
  "logo_2.png": "kartholder.png",
  "kartholder_2.png": "kartholder_2.png",
  "kartholder_3.png": "kartholder_3.png",
  "kartholder_4.png": "kartholder_4.png",
  "kartholder_5.png": "kartholder_5.png",
  "kartholder_6.png": "kartholder_6.png",
  "logo.png": "logo.png",
  "logo_2.png": "logo_2.png",
  "background_image.png": "background_image.png",
  "profile_photo_1.png": "profile_photo_1.png",
  "profile_photo_2.png": "profile_photo_2.png",
  "profile_photo_3.png": "profile_photo_3.png",
  "profile_photo_4.png": "profile_photo_4.png",
  "logo_3.png": "logo_3.png",
  "personal_photo.png": "personal_photo.png",
  "background_image_2.png": "background_image_2.png",
  "logo_4.png": "logo_4.png",
  
}; 

const filesToUpdate = [".html", ".css", ".js"];

function walk(dir) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Переименовываем картинки
for (const [oldName, newName] of Object.entries(renameMap)) {
  const oldPath = path.join(imagesDir, oldName);
  const newPath = path.join(imagesDir, newName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Переименовано: ${oldName} → ${newName}`);
  } else {
    console.log(`Не найдено: ${oldName}`);
  }
}

// 2. Обновляем пути в коде
const projectFiles = walk(projectDir).filter(file =>
  filesToUpdate.includes(path.extname(file))
);

for (const file of projectFiles) {
  let content = fs.readFileSync(file, "utf8");
  let updated = content;

  for (const [oldName, newName] of Object.entries(renameMap)) {
    updated = updated.replaceAll(oldName, newName);
  }

  if (updated !== content) {
    fs.writeFileSync(file, updated, "utf8");
    console.log(`Обновлены пути в: ${file}`);
  }
}

console.log("Готово!");