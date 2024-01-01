<?php // data.php
include './php/db.php';
include './php/fetchData.php';
include './php/utilities.php';

$db = new Database();
$conn = $db->getConnection();
$database = new fetchData($conn);

if (isset($_GET['works']) && isset($_GET['lang']) && isset($_GET['slug'])) {
  $lang = sanitizeInput($_GET['lang']);
  $slug = sanitizeInput($_GET['slug']);
  $lang = validateLanguage($lang);
  $slug = validateSlug($slug);

  $workData = $database->fetchWorks($slug, $lang);

  if ($workData) {
    $workimages = $database->fetchWorkImages($slug, $lang);
    $worklinks = $database->fetchWorkLinks($slug);
  
    $htmlOutput = <<<HTML
    <div id='content-inner'>
        <div id='content-inner-left'>
            <img src='/img/{$workData["slug"]}-0.jpg'>
            <div id='content-inner-left-text'></div>
        </div>
        <div id="separator">
          <a class="link" href="javascript:adjustWidth()">
            <div id="seperator-link" class="triangle"></div>
          </a>
        </div>
        <div id='content-inner-right'>
          <div id='content-inner-right-text'>
            <p>{$workData["text_$lang"]}</p>
              <div id='work-infos'>
              <p>{$workData["year"]}, {$workData["media_$lang"]}, {$workData["size_$lang"]}
    HTML;

    if (!empty($workData["edition"])) {
      $htmlOutput .= ", " . htmlspecialchars($workData["edition"]);
    } 
    $htmlOutput .= "</p></div>";

    foreach ($worklinks as $link) {
      $htmlOutput .= "<a href='" . htmlspecialchars($link["address"]) . "' target='_blank'>" . htmlspecialchars($link["description"]) . "</a>";
    }
    $htmlOutput .= '</div>';

    if (!empty($workData["vimeo"])) {
      $vimeo = $workData["vimeo"];
      $vimeoUrl = "https://vimeo.com/{$vimeo}";
      $htmlOutput .= <<<HTML
      <div style="padding:56.25% 0 0 0;position:relative;">
        <iframe src="https://player.vimeo.com/video/{$vimeo}?title=0&byline=0&portrait=0&badge=0" frameborder="0" allow="fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
      HTML;
    }
  
    foreach ($workimages as $image) {
      $imageName   = htmlspecialchars($image["name"]);
      $imageType   = htmlspecialchars($image["datatype"]);
      $imageText   = htmlspecialchars($image["text_$lang"]);
      $htmlOutput .= <<<HTML
      <img src='/img/{$imageName}.{$imageType}'>
      <div class="work-image-title">
        <p>$imageText</p>
      </div>
      HTML;
    }
    $htmlOutput .= "<div></div>";
    if (!empty($workData["3d"]) && $workData["3d"] == 1) {
      $htmlOutput .= <<<HTML
      <model-viewer id="embedded-model" src="/3d/{$slug}.gltf" alt="Ein 3D-Modell" camera-controls touch-action="pan-y" tone-mapping="agx" exposure="0.5" autoplay ar ar-modes="webxr scene-viewer" shadow-intensity="0" shadow-softness="1.5"></model-viewer>
      HTML;
    }
    $htmlOutput .= "</div></div>";

    $response = [
      'html' => $htmlOutput,
      'title' => $workData['title'],
      'descriptionDe' => $workData["description_$lang"],
      'descriptionEn' => $workData["description_$lang"]
    ];
    echo json_encode($response);

  } else { echo "No Data found!"; }
  $conn = null;
}

if (isset($_GET['exhibitions']) && isset($_GET['lang'])) {
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);

  $exhibitionData = $database->fetchExhibitions($lang);

  if ($exhibitionData) {
    $htmlOutput = "";
    foreach ($exhibitionData as $exhibition) {
      $htmlOutput .= "<div class='exhibition'>";
      $htmlOutput .= "<h2>" . htmlspecialchars($exhibition['title']) . "</h2>";
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition['institution']) . "</p>";
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition['place']) . "</p>";
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition["text_$lang"]) . "</p>";
      $htmlOutput .= "</div>";
    }

    $response = [
      'html' => $htmlOutput
    ];
    echo json_encode($response);
  } else { echo "No Data found!"; }
  $conn = null;
}

if (isset($_GET['about']) && isset($_GET['lang'])) {
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);

  $aboutData = $database->fetchAbout($lang);

  if ($aboutData) {
  $htmlOutput = "";
    foreach ($aboutData as $about) {
      $htmlOutput .= "<div class='about'>";
      $htmlOutput .= "<h2>" . htmlspecialchars($about['title']) . "</h2>";
      $htmlOutput .= "<p>" . htmlspecialchars($about["text_$lang"]) . "</p>";
      $htmlOutput .= "</div>";
    }

    $response = [
      'html' => $htmlOutput
    ];
    echo json_encode($response);
  } else { echo "No Data found!"; }
  $conn = null;
}
