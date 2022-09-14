package com.ivanfranchin.bookapi.runner;

import com.ivanfranchin.bookapi.model.Book;
import com.ivanfranchin.bookapi.model.User;
import com.ivanfranchin.bookapi.security.WebSecurityConfig;
import com.ivanfranchin.bookapi.service.BookService;
import com.ivanfranchin.bookapi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserService userService;
    private final BookService bookService;

    @Override
    public void run(String... args) {
        if (!userService.getUsers().isEmpty()) {
            return;
        }
        USERS.forEach(userService::saveUser);
        getBooks().forEach(bookService::saveBook);
        log.info("Database initialized");
    }

    private List<Book> getBooks() {
        return Arrays.stream(BOOKS_STR.split("\n"))
                .map(bookInfoStr -> bookInfoStr.split(";"))
                .map(bookInfoArr -> new Book(bookInfoArr[0], bookInfoArr[1]))
                .collect(Collectors.toList());
    }

    private static final List<User> USERS = Arrays.asList(
            new User("admin", "admin", "Admin", "admin@mycompany.com", WebSecurityConfig.ADMIN),
            new User("user", "user", "User", "user@mycompany.com", WebSecurityConfig.USER)
    );

    private static final String BOOKS_STR =
            """
                    9781603090773;Any Empire
                    9781603090698;August Moon
                    9781891830372;The Barefoot Serpent (softcover) by Scott Morse
                    9781603090292;BB Wolf and the 3 LP's
                    9781891830402;Beach Safari by Mawil
                    9781603094429;Belzebubs
                    9781891830563;Bighead by Jeffrey Brown
                    9781603094320;Bodycount
                    9781891830198;Box Office Poison
                    9780958578349;From Hell
                    9781603094221;Cat'n'Bat
                    9781603091008;Crater XV
                    9781891830815;Cry Yourself to Sleep by Jeremy Tinder
                    9781603092715;Dear Beloved Stranger
                    9781891830129;Dear Julia
                    9781891830921;Death by Chocolate - Redux
                    9781603090575;Dragon Puncher (Book 1)
                    9781603090858;Dragon Puncher (Book 2): Island
                    9781603093873;Eddie Campbell's Omnibox: The Complete ALEC and BACCHUS (3 Volume Slipcase)
                    9781603090360;Far Arden
                    9781603090537;Fingerprints
                    9781891830976;Fox Bunny Funny
                    9780958578349;From Hell
                    9781603093866;God Is Disappointed / Apocrypha Now — SLIPCASE SET
                    9781603090988;God Is Disappointed in You
                    9781603090087;Hieronymus B.
                    9781603094412;Highwayman
                    9781891830174;Hutch Owen (Vol 1): The Collected by Tom Hart
                    9781891830556;Hutch Owen (Vol 2): Unmarketable by Tom Hart
                    9781603090865;Hutch Owen (Vol 3): Let's Get Furious!
                    9781891830839;Infinite Kung Fu
                    9781891830655;The King by Rich Koslowski
                    9781603090001;The League of Extraordinary Gentlemen (Vol III): Century #1 - 1910
                    9781603090063;The League of Extraordinary Gentlemen (Vol III): Century #2 - 1969
                    9781603090070;The League of Extraordinary Gentlemen (Vol III): Century #3 - 2009
                    9781603094375;The League of Extraordinary Gentlemen (Vol III): Century
                    9781891830518;Less Than Heroes by David Yurkovich
                    9781603090704;Liar's Kiss
                    9781891830693;Lone Racer by Nicolas Mahler
                    9781603091527;The Lovely Horrible Stuff
                    9781603090094;Lower Regions
                    9781891830334;Magic Boy and the Robot Elf by James Kochalka
                    9781891830365;Monkey Vs. Robot (Vol 2): Crystal of Power by Koch.
                    9781603090759;Monster on the Hill (Book 1)
                    9781891830686;Mosquito by Dan James
                    9781603090490;Moving Pictures
                    9781603094092;Nate Powell's OMNIBOX
                    9781603090681;Okie Dokie Donuts (Story 1): Open for Business!
                    9781891830297;Pinky & Stinky by James Kochalka
                    9781603090711;Pirate Penguin vs Ninja Chicken (Book 1): Troublems with Frenemies
                    9781603093675;Pirate Penguin vs Ninja Chicken (Book 2): Escape from Skull-Fragment Island!
                    9781603094139;Return of the Dapper Men (Deluxe Edition)
                    9781603090896;Scene But Not Heard
                    9781603094450;A Shining Beacon
                    9781891830143;Speechless
                    9781891830501;Spiral-Bound by Aaron Renier
                    9781603090209;Sulk (Vol 1): Bighead and Friends
                    9781603090315;Sulk (Vol 2): Deadly Awesome
                    9781603090551;Sulk (Vol 3): The Kind of Strength...
                    9781891830969;Super Spy
                    9781603090438;Super Spy (Vol 2): The Lost Dossiers
                    9781603090339;Swallow Me Whole
                    9781603090056;That Salty Air
                    9781603094504;They Called Us Enemy
                    9781891830310;Three Fingers by Rich Koslowski
                    9781891830983;Too Cool to Be Forgotten
                    9781603090742;The Underwater Welder
                    9781603090889;Upside Down (Book 1): A Vampire Tale
                    9781603093712;Upside Down (Book 2): A Hat Full of Spells
                    9781891830723;Will You Still Love Me If I Wet the Bed by Liz Prince
                    9781603094405;Ye
                    """;
}
