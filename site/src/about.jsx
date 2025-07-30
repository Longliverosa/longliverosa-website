import './about.css';
import { Navbar } from "./App";

function About() {
  return (
    <>
      <Navbar />
      <div className="about-form-container" style={{ marginTop: "80px" }}>
        <h2>Who are we</h2>
        <p>
          We are the DougDoug Community, united by our love for Rosa the sea otter and the joy of creating together. Through our Discord server, we’ve come together to work collaboratively on the Long Live Rosa game—an entirely community-driven tribute built in pixel art using the Godot engine.
        </p>
        <p>
          <strong>There is no official involvement from DougDoug (or his collaborators), the Monterey Bay Aquarium, or any other organisation or authority.</strong>
        </p>

        <h2>The goal</h2>
        <p>
          Together, as the DougDoug viewership community, we aim to collaboratively create a pixel-art 2D puzzle-platformer where players control Rosa the sea otter as the protagonist.
        </p>
        <p>
          Built in Godot, this game will feature levels inspired by her life and her habitat—swimming through kelp forests, rescuing stranded pups, solving ecological puzzles tied to kelp‑forest conservation, and celebrating her playful and caring spirit.
        </p>
        <ul>
          <li>
            <strong>Puzzle-platformer mechanics:</strong> Jump, swim, push and pull objects, navigate obstacles, and solve environmental challenges.
          </li>
          <li>
            <strong>Pixel-art style:</strong> Charming, handcrafted visuals created by the community.
          </li>
          <li>
            <strong>Godot engine:</strong> Chosen for its accessibility, strong 2D support, and vibrant community—making it an ideal platform for an open development process.
          </li>
        </ul>
        <p>
          The Godot community regularly collaborates on multiplayer jams, open-source tools, and group projects, making it a perfect fit for our collaborative game development journey!
        </p>

        <h2>How to get involved</h2>
        <p>
          Join our Discord to gain access to channels where you can contribute or just spectate.<br />
          Head over to the github repositories to contribute to the game or website.<br />
          Everyone is welcome—whether you're pitching art ideas, writing puzzles in Godot GDScript, composing sea‑shanties for bonus music, or helping moderate asset submission threads.
        </p>
      </div>
    </>
  )
}

export default About;
