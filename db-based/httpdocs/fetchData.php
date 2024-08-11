<?php // fetchData.php for davidherren.ch / 2024-08-11
class fetchData {
  private $conn;

  public function __construct($conn) {
    $this->conn = $conn;
  }

  public function fetchWorks($slug, $lang) {
    $sql = "SELECT slug, title, year, edition, vimeo_id, vimeo_ratio, github, 3d, 
                    info_$lang, media_$lang, size_$lang, text_$lang, description_$lang,
                    info_de, media_de, size_de, text_de, description_de, img_alt, publish
            FROM works 
            WHERE slug = :slug AND publish = 1";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmt->execute();
    $workData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($workData["info_$lang"])) {
      $workData["info_$lang"] = $workData["info_de"];
    }
    if (empty($workData["media_$lang"])) {
        $workData["media_$lang"] = $workData["media_de"];
    }
    if (empty($workData["size_$lang"])) {
        $workData["size_$lang"] = $workData["size_de"];
    }
    if (empty($workData["text_$lang"])) {
        $workData["text_$lang"] = $workData["text_de"];
    }
    if (empty($workData["description_$lang"])) {
        $workData["description_$lang"] = $workData["description_de"];
    }
    return $workData;
  }

  public function fetchWorkImages($slug, $lang) {
    $sqlImages = "SELECT name, datatype, text_$lang, text_de, alt, created, year, copyright
                  FROM images
                  WHERE slug = :slug";
    $stmtImages = $this->conn->prepare($sqlImages);
    $stmtImages->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmtImages->execute();
    $images = $stmtImages->fetchAll(PDO::FETCH_ASSOC);
  
    foreach ($images as $key => $image) {
        if (empty($image["text_$lang"])) {
            $images[$key]["text_$lang"] = $image["text_de"];
        }
        if (preg_match('/-(\d+)$/', $image['name'], $matches)) {
            $images[$key]['number'] = (int)$matches[1];
        } else {
            $images[$key]['number'] = null;
        }
    }
    usort($images, function($a, $b) {
        return strnatcmp($a['name'], $b['name']);
    });
    return $images;
  }
  
  public function fetchWorkLinks($slug) {
    $sqlLinks = "SELECT links.address, links.description
                 FROM works_links
                 JOIN links ON works_links.link = links.id
                 WHERE works_links.work = :slug";
    $stmtLinks = $this->conn->prepare($sqlLinks);
    $stmtLinks->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmtLinks->execute();
    return $stmtLinks->fetchAll(PDO::FETCH_ASSOC);
  }

  public function fetchMediaLink($mediaId) {
    $sql = "SELECT links.address
            FROM media_links
            JOIN links ON media_links.link = links.id
            WHERE media_links.media = :mediaId
            LIMIT 1";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':mediaId', $mediaId, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        return $result['address'];
    } else {
        return null;
    }
  }

  public function fetchExhibitions($lang) {
    $sql = "SELECT title, institution, place_$lang, text_$lang, place_de, date_start, date_end, img
            FROM exhibitions
            WHERE selected = 1
            ORDER BY date_start DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $key => $row) {
      if (empty($row["place_$lang"])) {
        $results[$key]["place_$lang"] = $row["place_de"];
      }
    }
    return $results;
  }

  public function fetchExhibitionMainLink($exhibitionTitle) {
    $sql = "SELECT links.address FROM exhibitions_links
            JOIN links ON exhibitions_links.link = links.id
            JOIN exhibitions ON exhibitions_links.exhibition = exhibitions.title
            WHERE exhibitions.title = :exhibitionTitle AND exhibitions_links.mainlink = 1
            LIMIT 1";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(':exhibitionTitle', $exhibitionTitle, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        return $result['address'];
    } else {
        return null;
    }
  }

  public function fetchMenuItems() {
    $sql = "SELECT slug, title, publish
            FROM works
            WHERE publish = 1
            ORDER BY nr DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function fetchIndexItems($lang) {
    $sql = "SELECT slug, title, year, description_de, description_en, nr, landingpage, publish
            FROM works
            WHERE landingpage = 1 AND publish = 1
            ORDER BY nr DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results;
  }

  public function fetchAllItems($lang) {
    $sql = "SELECT slug, title, year, description_de, description_en, nr, publish
            FROM works
            WHERE publish = 1
            ORDER BY nr DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results;
  }

  public function fetchAbout($lang) {
    $sql = "SELECT section, section_de, date, time, title, text_$lang, text_de
            FROM about
            ORDER BY section, date DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($results as $key => $row) {
      if (empty($row["text_$lang"])) {
        $results[$key]["text_$lang"] = $row["text_de"];
      }
    }
    return $results;
  }

  public function fetchAboutStatement($lang) {
    $sql = "SELECT text_$lang
            FROM about
            WHERE section = 'about'
            ORDER BY section, date DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result["text_$lang"] : '';
  }

  public function fetchAboutImprint($lang) {
    $sql = "SELECT text_$lang
            FROM about
            WHERE section = 'imprint'
            ORDER BY section, date DESC";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result["text_$lang"] : '';
  }
}
?>
