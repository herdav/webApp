<?php // data.php for davidherren.ch / 2024-11-06

include './php/db.php';
include './php/fetchData.php';
include './php/utilities.php';

$db = new Database();
$conn = $db->getConnection();
$database = new fetchData($conn);

if (isset($_GET['index']) && isset($_GET['lang'])) {
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);
  $indexResult = $database->fetchIndexItems($lang);
  $htmlOutput = '';

  if ($lang === 'de') {
    $progText = 'Projekt in Arbeit';
  } else {
    $progText = 'Work in Proress';
  }

  if (count($indexResult) > 0) {
    /*shuffle($indexResult);*/
    foreach ($indexResult as $index => $row) {
      $title = $row["title"];
      $slug = $row["slug"];
      $year = $row["year"];
      $prog = $row["in_progress"];
      $description = $row["description_$lang"];
      $htmlOutput .= "<a class='index-item' href='/" . htmlspecialchars($lang) . "/" . htmlspecialchars($slug) . "'>";
      $htmlOutput .= "<div class='index-item-inner'>";
      if ($prog == 1) { $htmlOutput .= "<div class='work-in-progress'><p class='frame'>$progText</p></div>"; }
      $htmlOutput .= "<div class='index-item-inner-text'>";
      $htmlOutput .= "<h2>" . htmlspecialchars($title) . "</h2>";
      $htmlOutput .= "<p>" . htmlspecialchars($year) . "<br><i>" . htmlspecialchars($description) . "</i></p>";
      $htmlOutput .= "</div>";
      $htmlOutput .= "<img src='/img/prev/" . htmlspecialchars($slug) . "-prev.jpg' loading='lazy' alt='" . htmlspecialchars($title) . " - " . htmlspecialchars($year) . " © David Herren'>";
      $htmlOutput .= "</div></a>";
    }
  } else {
    $htmlOutput = "No works found!";
  }
  echo json_encode(['html' => $htmlOutput]);
  exit;
}

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
        <div class="content-left-img-outer">
    HTML;
    if ($workData["in_progress"] == 1) {
      if($lang === 'de') {
        $progText = 'Projekt in Arbeit';
      } else {
        $progText = 'Work in Proress';
      }
      $htmlOutput .= "<div class='work-in-progress'><p class='frame'>$progText</p>";
      $htmlOutput .= "";
      $htmlOutput .= "</div>";
    }

    if($workimages[0]['alt']) {
      if ($workimages[0]['created']) {
        $htmlOutput .= <<<HTML
        <img src="/img/{$workData['slug']}-0.jpg" alt="{$workimages[0]['alt']}, {$workimages[0]['year']} - Foto: {$workimages[0]['created']}">
    HTML;
      }
     } else {
        $htmlOutput .= <<<HTML
        <img src="/img/{$workData['slug']}-0.jpg" alt="{$workData['title']} © {$workimages[0]['year']} {$workimages[0]['copyright']}">
    HTML;
      }

    $htmlOutput .= "<p>{$workimages[0]["text_$lang"]}, {$workimages[0]["year"]}";

    if($workimages[0]['created']) {
      $htmlOutput .= ". Foto: {$workimages[0]['created']}</p>";
    } else {
      $htmlOutput .= ".</p>";
      }
      $htmlOutput .= '</div><div id="content-inner-left-text">';

    $workimages = array_slice($workimages, 1);
    foreach ($workimages as $image) {
      $imageText = $image["text_$lang"];
      $workTitle = $workData["title"];
      $imageCreated = $image["created"];
      $htmlOutput .= <<<HTML
      <div class="work-image-title">
        <div class="frame work-title-sub pattern">
          <div class="frame-title">
            <a href="#top" class="frame-title-left button-navigation"></a>
            <h3 class="frame-title-center">$workTitle</h3>
          </div>
          <div class="frame-title-text">
          <p>$imageText</p>
      HTML;
        if ($imageCreated) {
          $htmlOutput .= <<<HTML
            <p>Foto: $imageCreated</p>
          </div>
        </div></div>
        HTML;
      } else {
        $htmlOutput .= <<<HTML
          </div>
        </div></div>
        HTML;
      }
    }

    if (!empty($workData["vimeo_id"])) {
      $vimeoId = $workData["vimeo_id"];
      $vimeoRatio = $workData["vimeo_ratio"];
      if (!empty($workData["vimeo_$lang"])) {
        $vimeoText = $workData["vimeo_$lang"];
      } else {
        $vimeoText = 'Video @ <a href="https://vimeo.com/{$vimeoId}" target="_blank">Vimeo</a>';
      }
      $htmlOutput .= <<<HTML
      <div class="work-video-title">
        <div class="frame work-title-sub pattern">
          <div class="frame-title">
            <a href="#top" class="frame-title-left button-navigation"></a>
            <h3 class="frame-title-center">$workTitle</h3>
          </div>
          <div class="frame-title-text">
          <p>$vimeoText</p>
          </div>
        </div></div>
      HTML;
    }

    if (!empty($workData["3d"]) && $workData["3d"] == 1) {
      if(!empty($workData["3d_$lang"])) {
        $modelText = $workData["3d_$lang"];
      } else if ($lang === "de") {
        $modelText = "3D-Modell der Arbeit, die Integration für die Website ist mit <a href='https://blender.org' target='_blank'>Blender</a> erstellt.";
      } else {
        $modelText = "3D model of the work, the integration for the website is created with <a href='https://blender.org' target='_blank'>Blender</a>.";
      }  
      
      $htmlOutput .= <<<HTML
      <div class="work-model-title">
        <div class="frame work-title-sub pattern">
          <div class="frame-title">
            <a href="#top" class="frame-title-left button-navigation"></a>
            <h3 class="frame-title-center">$workTitle</h3>
          </div>
          <div class="frame-title-text">
          <p>$modelText</p>
          </div>
        </div></div>
      HTML;
    }

    // Closing the left content div
    $htmlOutput .= "</div></div>";
    $htmlOutput .= <<<HTML
    <div id="content-inner-center">
      <a aria-label="Expand Pointer" id="pointer" href="">
        <svg width="72" height="56" viewBox="0 0 72 56" class="svg-arrow">
          <rect id="svg-arrow-0" x="0"  y="24" width="72" height="4"/>
          <rect id="svg-arrow-1" x="4"  y="28" width="4" height="4"/>
          <rect id="svg-arrow-2" x="8"  y="32" width="4" height="4"/>
          <rect id="svg-arrow-3" x="12" y="36" width="4" height="4"/>
          <rect id="svg-arrow-4" x="16" y="40" width="4" height="4"/>
          <rect id="svg-arrow-5" x="20" y="44" width="4" height="4"/>
          <rect id="svg-arrow-6" x="24" y="48" width="4" height="4"/>
          <rect id="svg-arrow-7" x="4"  y="20" width="4" height="4"/>
          <rect id="svg-arrow-8" x="8"  y="16" width="4" height="4"/>
          <rect id="svg-arrow-9" x="12" y="12" width="4" height="4"/>
          <rect id="svg-arrow-10" x="16" y="8"  width="4" height="4"/>
          <rect id="svg-arrow-11" x="20" y="4"  width="4" height="4"/>
          <rect id="svg-arrow-12" x="24" y="0"  width="4" height="4"/>
        </svg>
      </a>
    </div>
    <div id='content-inner-right'>
      <div id='work-text'>
        <p id="work-text-description">{$workData["description_$lang"]}</p>
        <div id="work-text-inline"><p>{$workData["text_$lang"]}</p></div>
      <div id='work-infos'>
    HTML;

    // Check if info_$lang is not empty and use it, otherwise use year, media, size
    if (!empty($workData["info_$lang"])) {
        $htmlOutput .= "<p>{$workData["year"]}, {$workData["info_$lang"]}</p>";
    } else {
        $htmlOutput .= "<p>{$workData["year"]}, {$workData["media_$lang"]}, {$workData["size_$lang"]}";
        if (!empty($workData["edition"])) {
            $htmlOutput .= ", " . htmlspecialchars($workData["edition"]);
        }
        $htmlOutput .= "</p>";
    }

    $htmlOutput .= "</div>"; // Closing tag for work-infos div

    $htmlOutput .= "<div id='work-links'>";
    foreach ($worklinks as $link) {
      $htmlOutput .= "<a href='" . htmlspecialchars($link["address"]) . "' target='_blank'>" . htmlspecialchars($link["description"]) . "</a> ";
    }
    if ($workData["github"]) {
      $htmlOutput .= "<a href='" . htmlspecialchars($workData["github"]) . "' target='_blank'>GitHub</a> ";
    }

    $htmlOutput .= '</div></div><div id="work-adds">';

    // Code for displaying additional images
    $htmlOutput .= "<div class='work-images'>";
    /*$workimages = array_slice($workimages, 1);*/
    foreach ($workimages as $image) {
      $workTitle      = htmlspecialchars($workData["title"]);
      $imageName      = htmlspecialchars($image["name"]);
      $imageType      = htmlspecialchars($image["datatype"]);
      $imageAlt       = htmlspecialchars($image["alt"]);
      $imageCreated   = htmlspecialchars($image["created"]);
      $imageCopyright = htmlspecialchars($image["copyright"]);
      $imageYear      = htmlspecialchars($image["year"]);
      $imageNumber    = htmlspecialchars($image["number"]);

      if ($imageAlt) {
        if ($imageCreated) {
          $htmlOutput .= "<div class='abb-anchor' id='_abb{$imageNumber}'></div><img src='/img/{$imageName}.{$imageType}' alt='$imageAlt, $imageYear - Foto: $imageCreated'>";
        }
      } else if ($imageCreated) {
        $htmlOutput .= "<div class='abb-anchor' id='_abb{$imageNumber}'></div><img src='/img/{$imageName}.{$imageType}' alt='$workTitle - Foto: $imageCreated'>";
      } else {
        $htmlOutput .= "<div class='abb-anchor' id='_abb{$imageNumber}'></div><img id='_abb{$imageNumber}' src='/img/{$imageName}.{$imageType}' alt='© $imageYear $imageCopyright'>";
      }
    }

    $htmlOutput .= "</div>";
   
    // Code for vimeo video
    if (!empty($workData["vimeo_id"])) {
      $padding = 10000 / $workData['vimeo_ratio'];
      $htmlOutput .= <<<HTML
      <div id='work-video'>
        <div style="padding:{$padding}% 0 0 0;position:relative;">
          <iframe title="Vimeo Player" src="https://player.vimeo.com/video/{$workData['vimeo_id']}?title=0&byline=0&portrait=0&badge=0&dnt=1&app_id=58479" frameborder="0" allow="fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </div>
      HTML;
    }

    // Code for 3D model viewer
    if (!empty($workData["3d"]) && $workData["3d"] == 1) {
      $htmlOutput .= <<<HTML
      <model-viewer id="embedded-model" src="/3d/{$slug}.gltf" alt="3D Model of {$workTitle} - $workData[year] © by David Herren" camera-controls touch-action="pan-y" tone-mapping="agx" exposure="0.5" autoplay ar ar-modes="webxr scene-viewer" shadow-intensity="0" shadow-softness="1.5"></model-viewer>
      HTML;
    }

    $htmlOutput .= "</div></div></div></div>";

    $indexResult = $database->fetchAllItems($lang);
    $htmlOutput .= "<div id='content-bottom'>";
    if (count($indexResult) > 0) {
      shuffle($indexResult); // Shuffle the array to randomize the order of items
      $displayCount = 0;
      foreach ($indexResult as $row) {
        $title = $row["title"];
        $thisSlug = $row["slug"];
        $year = $row["year"];
        if ($thisSlug != $slug) {
          $description = $lang === 'de' ? $row["description_de"] : $row["description_en"];
          $htmlOutput .= "<a class='index-item work' href='/" . htmlspecialchars($lang) . "/" . htmlspecialchars($thisSlug) . "'>";
          $htmlOutput .= "<div class='index-item-inner'>";
          $htmlOutput .= "<div class='index-item-inner-text'>";
          $htmlOutput .= "<h2>" . htmlspecialchars($title) . "</h2>";
          $htmlOutput .= "<p>" . htmlspecialchars($year) . "<br><i>" . htmlspecialchars($description) . "</i></p>";
          $htmlOutput .= "</div>";
          $htmlOutput .= "<img src='/img/prev/" . htmlspecialchars($thisSlug) . "-prev.jpg' alt='" . htmlspecialchars($title) . " - " . htmlspecialchars($year) . " © David Herren'>";
          $htmlOutput .= "</div></a>";

          $displayCount++;
          if ($displayCount >= 8) {
            break;
          }
        }
      }
    } else {
      $htmlOutput = "No works found!";
    }    
    $htmlOutput .= "</div>";

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

if (isset($_GET['about']) && isset($_GET['lang'])) {
  // Sanitize and validate input
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);

  // Fetch data from database
  $aboutData = $database->fetchAbout($lang);
  $exhibitionData = $database->fetchExhibitions($lang);

  $htmlOutput = "";
  $htmlOutput .= "<div id='about'>";
  $htmlOutput .= "<div id='about-left'>";

  // Processing aboutData for 'about'
  if ($aboutData) {

    foreach ($aboutData as $about) {
      // Processing aboutData for 'about'
      if ($about['section'] === 'about') {
        // Adding section titles
        if (!isset($lastSection) || $lastSection !== $about['section']) {
          if ($lang === 'de') {
            $titleSection = htmlspecialchars(ucfirst($about['section_de']));
          } else {
            $titleSection = htmlspecialchars(ucfirst($about['section']));
          }
          $htmlOutput .= "<h2 class='about-title'>" . $titleSection . "</h2>";
          $lastSection = $about['section'];
        }
        
        // Displaying about-items
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        
        if ($about['time']) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($about['time']) . "</p></div>";
        }
        if ($about['title']) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . htmlspecialchars($about['title']);

        } else if (!$about['title'] && $about["text_$lang"]) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . strip_tags($about["text_$lang"], '<br><a>');;

        } else if ($about["text_$lang"]) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . strip_tags($about["text_$lang"], '<br><a>');;
        }
        $htmlOutput .= "</p>" . "</div></div>";
      }

      // Processing aboutData for 'education'
      if ($about['section'] === 'education') {
        // Adding section titles
        if (!isset($lastSection) || $lastSection !== $about['section']) {
          if ($lang === 'de') {
            $titleSection = htmlspecialchars(ucfirst($about['section_de']));
          } else {
            $titleSection = htmlspecialchars(ucfirst($about['section']));
          }
          $htmlOutput .= "<h2 class='about-title'>" . $titleSection . "</h2>";
          $lastSection = $about['section'];
        }
        // Displaying about-items
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        if ($about['time']) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($about['time']) . "</p></div>";
        }
        if ($about['title']) {
          $htmlOutput .= "<div style='flex: 4;'>";
          $htmlOutput .= "<p>" . htmlspecialchars($about['title']);
        } else if (!$about['title'] && $about["text_$lang"]) { // education
          $htmlOutput .= "<div style='flex: 4;'>";
          $htmlOutput .= "<p>" . strip_tags($about["text_$lang"], '<br><a>');

        } else if ($about["text_$lang"]) {
          $htmlOutput .= "<div style='flex: 4;'>";
          $htmlOutput .= "<p>" . strip_tags($about["text_$lang"], '<br><a>');;
        }

        $htmlOutput .= "</p>" . "</div></div>";
      }

      // Processing aboutData for 'media'
      if ($about['section'] === 'media') {
        // Adding section titles
        if (!isset($lastSection) || $lastSection !== $about['section']) {
          if ($lang === 'de') {
            $titleSection = htmlspecialchars(ucfirst($about['section_de']));
          } else {
            $titleSection = htmlspecialchars(ucfirst($about['section']));
          }
          $htmlOutput .= "<div id='about-media'><h2 class='about-title'>" . $titleSection . "</h2>";
          $lastSection = $about['section'];
        }
        // Displaying about-items
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        if ($about['time']) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($about['time']) . "</p></div>";
        }
        if ($about['title']) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $firstLink = $database->fetchMediaLink(htmlspecialchars($about['title']));
          if ($firstLink) {
              $htmlOutput .= "<p>" . "<a target='_blank' href='" . htmlspecialchars($firstLink) . "'>" . htmlspecialchars($about['title']) . "</a>";
          } else {
              $htmlOutput .= "<p>"  . htmlspecialchars($about['title']);
          }
        }
        if ($about["text_$lang"]) {
          $htmlOutput .= ", " . $about["text_$lang"] . "</p>";
        }
        $htmlOutput .= "</div></div>";
      }
    }

    $htmlOutput .= "</div></div>"; // End of about-left
    $htmlOutput .= "<div id='about-right'>"; // Start of about-right

    // Processing exhibitionData for 'exhibition'
    if ($exhibitionData) {
      $lastYear = null;
      $htmlOutput .= "<div id='exhibitions'>";
      if ($lang === 'de') {
        $htmlOutput .= "<h2 class='about-title'>Austellungen</h2>";
      } else {
        $htmlOutput .= "<h2 class='about-title'>Exhibitions</h2>";
      }
      foreach ($exhibitionData as $index => $exhibition) {
        $yearStart = substr($exhibition["date_start"], 0, 4);
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        if ($yearStart !== $lastYear) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($yearStart) . "</p></div>";
          $lastYear = $yearStart;
        } else {
          $htmlOutput .= "<div style='flex: 1;'></div>";
        }
        $htmlOutput .= "<div style='flex: 4;'><div class='exhibition-sub-main'>";

        $firstLink = $database->fetchExhibitionMainLink($exhibition['title']);
        if ($firstLink) {
            $htmlOutput .= "<p>" . "<a target='_blank' href='" . $firstLink . "'>" . htmlspecialchars($exhibition['title']) . "</a>" . ", ";
        } else {
            $htmlOutput .= "<p>"  . $exhibition['title'] . ", ";
        }
        $htmlOutput .= $exhibition['institution'] . ', ' . $exhibition["place_$lang"];
        if ($exhibition["sup_$lang"]) {
          $htmlOutput .= ' <sup>' . $exhibition["sup_$lang"] . '</sup>';
        }
        $htmlOutput .= '</p>';

        $buttonId = "button-dropdown-" . $index;
        $htmlOutput .= "<button aria-label='button-exhibition-open' id='" . $buttonId . "' class='button-navigation exhibition' onclick=\"expandImage('" . htmlspecialchars($exhibition['img']) . "', '" . $buttonId . "'); toggleTriangles('" . $buttonId . "');\">
          <svg id='dropdown-svg' width='56px' height='32px' viewBox='0 0 56 32' xmlns='http://www.w3.org/2000/svg'>
            <rect x='0'  y='24' width='56' id='svg-triangle-1' height='8'/>
            <rect x='8'  y='16' width='40' id='svg-triangle-2' height='8'/>
            <rect x='16' y='8'  width='24' id='svg-triangle-3' height='8'/>
            <rect x='24' y='0'  width='8'  id='svg-triangle-4' height='8'/>
          </svg>
        </button></div>";
        
        $htmlOutput .= "<div id='" . htmlspecialchars($exhibition['img']) . "' class='exhibition-img'><img src='/img/exhibitions/" . htmlspecialchars($exhibition['img']) . ".jpg' alt='" . $exhibition['title'] . " - " . htmlspecialchars($yearStart) . "'>";
        $htmlOutput .= '<p>' . htmlspecialchars($exhibition["text_$lang"]) . '<br><br>';
        $dateObjectStart = new DateTime($exhibition["date_start"]);
        $dateObjectEnd = new DateTime($exhibition["date_end"]);
        if ($dateObjectEnd->format('Y') != $dateObjectStart->format('Y')) {
          $formattedDateStart = $dateObjectStart->format('d.m.Y');
        } else {
          $formattedDateStart = $dateObjectStart->format('d.m.');
        }
        $formattedDateEnd = $dateObjectEnd->format('d.m.Y');
        $htmlOutput .= htmlspecialchars($formattedDateStart) . '—';
        $htmlOutput .= htmlspecialchars($formattedDateEnd) . '</p>';
        $htmlOutput .= "</div></div></div>";
      }
      $htmlOutput .= "</div>"; // End of Exhibition section
    }

    // Processing aboutData for 'imprint'
    if ($about['section'] === 'imprint') {
      if (!isset($lastSection) || $lastSection !== $about['section']) {
        if ($lang === 'de') {
          $titleSection = htmlspecialchars(ucfirst($about['section_de']));
        } else {
          $titleSection = htmlspecialchars(ucfirst($about['section']));
        }
        $htmlOutput .= "<div id='about-imprint'><div><h2 class='about-title'>" . $titleSection . "</h2>";
        $htmlOutput .= "<p>" . strip_tags($about["text_$lang"], '<br><a>') . "</p></div></div>";
      }
    }
  }

  $htmlOutput .= "</div>"; // End of about-right
  $htmlOutput .= "</div>";

  // Send response
  $response = [
    'html' => $htmlOutput,
    'descriptionDe' => $database->fetchAboutStatement("de"),
    'descriptionEn' => $database->fetchAboutStatement("en")
  ];

  echo json_encode($response);

  // Close database connection
  $conn = null;
}

if (isset($_GET['statement'])) {
  $lang = sanitizeInput($_GET['statement']);
  $lang = validateLanguage($lang);
  echo json_encode(['description' => $database->fetchAboutStatement($lang)]);
}
?>
